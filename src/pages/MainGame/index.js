import { questionsArray, ROUTE_CONSTANTS, FIRESTORE_PATH_NAMES } from "../../core/utils/constants"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../../services/firebase"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { playSoundOnDemand, startBackgroundMusic, stopBackgroundMusic } from "../../core/Sounds-Logic/logic"
import { SoundOutlined, MutedOutlined } from '@ant-design/icons'
import GameEndModal from "../../components/GameEndModal"
import correctAnswerSound from '../../core/Sounds-Logic/sounds/correct-answer-sound.mp3'
import wrongAnswerSound from '../../core/Sounds-Logic/sounds/wrong-answer-sound.mp3'
import './index.css'
import { Button } from "antd"

const getRandomIndex = (array) => Math.floor(Math.random() * array.length)

const MainGame = ({ userInfo }) => {
    const [remainingQuestions, setRemainingQuestions] = useState([...questionsArray])
    const [currentQuestion, setCurrentQuestion] = useState(questionsArray[getRandomIndex(remainingQuestions)])
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
    const [prizeAmount, setPrizeAmount] = useState(500)
    const [isHelpUsed, setIsHelpUsed] = useState({ hallHelp: false, fiftyFifty: false })
    const [isGameEndModalOpen, setIsGameEndModalOpen] = useState(false)
    const [gameEndMessage, setGameEndMessage] = useState('')
    const [isMusicOn, setIsMusicOn] = useState(false)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)

    const navigate = useNavigate()
    const fixedWinningMoney = [8000, 32000, 128000]
    const { uid } = userInfo

    useEffect(() => {
        if (isMusicOn) {
            startBackgroundMusic()
        } else {
            stopBackgroundMusic()
        }

        const savedGameState = JSON.parse(sessionStorage.getItem('gameState'))

        if (savedGameState) {
            setRemainingQuestions(savedGameState.remainingQuestions)
            setCurrentQuestion(savedGameState.currentQuestion)
            setCorrectAnswerCount(savedGameState.correctAnswerCount)
            setPrizeAmount(savedGameState.prizeAmount)
            setIsHelpUsed(savedGameState.isHelpUsed)
        } else {
            const initialQuestion = questionsArray[getRandomIndex(questionsArray)]
            setRemainingQuestions([...questionsArray])
            setCurrentQuestion(initialQuestion)
        }
    }, [isMusicOn])

    const updateGameStateInSessionStorage = useCallback(() => {
        const gameState = {
            remainingQuestions,
            currentQuestion,
            correctAnswerCount,
            prizeAmount,
            isHelpUsed,
        };
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }, [correctAnswerCount, currentQuestion, isHelpUsed, prizeAmount, remainingQuestions]);

    useEffect(() => {
        updateGameStateInSessionStorage()
    }, [updateGameStateInSessionStorage])


    const saveQuizProgress = async (questionData) => {
        try {
            const userRef = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
            await updateDoc(userRef, {
                quizHistory: arrayUnion(questionData)
            })
        } catch (error) {
            console.error('Error saving quiz data in Firebase:', error)
        }
    }

    const saveFinalScore = async (finalScore) => {
        try {
            const userRef = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
            await updateDoc(userRef, {
                quizHistory: arrayUnion({ finalScore })
            })
        } catch (error) {
            console.error('Error during saving final score:', error)
        }
    }

    const getFixedWinningAmount = (prizeAmount) => {
        for (let i = fixedWinningMoney.length - 1; i >= 0; i--) {
            if (prizeAmount >= fixedWinningMoney[i]) {
                return fixedWinningMoney[i]
            }
        }
        return 0
    }

    const playSound = (sound) => {
        if (isMusicOn) {
            playSoundOnDemand(sound)
        }
    }

    const handleAnswer = async (selectedIndex) => {
        setSelectedAnswerIndex(selectedIndex)

        const questionData = {
            question: currentQuestion.question,
            selectedAnswer: currentQuestion.options[selectedIndex],
            isCorrect: selectedIndex === currentQuestion.correctAnswer
        }

        await saveQuizProgress(questionData)
        updateGameStateInSessionStorage()

        if (questionData.isCorrect) {
            playSound(correctAnswerSound)
            const newCorrectAnswerCount = correctAnswerCount + 1
            setCorrectAnswerCount(newCorrectAnswerCount)
            const newPrizeAmount = Math.min(prizeAmount * 2, 1000000)
            setPrizeAmount(newPrizeAmount)


            if (newCorrectAnswerCount === 12) {
                setGameEndMessage(`Congratulations! You won ${prizeAmount} AMD`)
                setIsGameEndModalOpen(true)
                await saveFinalScore(prizeAmount)
                return;
            }

            moveToNextQuestion()
        } else {
            playSound(wrongAnswerSound)
            const winningAmount = getFixedWinningAmount(prizeAmount / 2)
            setGameEndMessage(`Wrong answer! You won ${winningAmount} AMD. Try again!`)
            setIsGameEndModalOpen(true)
            await saveFinalScore(winningAmount)
            return;
        }
    }

    const moveToNextQuestion = () => {
        const newRemainingQuestions = remainingQuestions.filter(q => q !== currentQuestion)
        setRemainingQuestions(newRemainingQuestions)
        setCurrentQuestion(newRemainingQuestions[getRandomIndex(newRemainingQuestions)])
        setSelectedAnswerIndex(null)
    }

    const handleHallHelp = () => {
        if (!isHelpUsed.hallHelp) {
            alert(`The correct answer is ${currentQuestion.options[currentQuestion.correctAnswer]}`)
            setIsHelpUsed(prev => ({ ...prev, hallHelp: true }))
        }
    }

    const handlefiftyFifty = () => {
        if (!isHelpUsed.fiftyFifty) {
            const correctAnswerIndex = currentQuestion.correctAnswer
            const incorrectOptions = currentQuestion.options
                .map((option, index) => index)
                .filter(index => index !== correctAnswerIndex)
            const remainingIncorrectIndex = incorrectOptions[getRandomIndex(incorrectOptions)]
            const newOptions = currentQuestion.options.map((option, index) => {
                if (index === correctAnswerIndex || index === remainingIncorrectIndex) {
                    return option
                }
                return null
            })
            setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
            setIsHelpUsed(prev => ({ ...prev, fiftyFifty: true }))
        }
    }

    const toggleMusic = () => {
        setIsMusicOn((prev) => {
            const newState = !prev

            if (newState) {
                startBackgroundMusic()
            } else {
                stopBackgroundMusic()
            }
            return newState
        })
    }

    const getButtonColor = (index) => {
        if (selectedAnswerIndex === null) return ''
        return index === selectedAnswerIndex ? (index === currentQuestion.correctAnswer ? 'green' : 'red') : ''
    }

    const resetGame = () => {
        setRemainingQuestions([...questionsArray])
        setCurrentQuestion(questionsArray[getRandomIndex(questionsArray)])
        setCorrectAnswerCount(0)
        setPrizeAmount(500)
        setIsHelpUsed({ hallHelp: false, fiftyFifty: false })
        setIsGameEndModalOpen(false)
        sessionStorage.removeItem('gameState')
        setIsMusicOn(false)
        setSelectedAnswerIndex(null)
    }

    const exitGame = () => {
        navigate(ROUTE_CONSTANTS.HOMEPAGE)
        resetGame()
    }

    return (
        <div className="game_container">
            <div className="question_title">{currentQuestion.question}</div>
            <div className="options_container">
                <div className="options">
                    <button
                        className="option"
                        onClick={() => handleAnswer(0)}
                        style={{ backgroundColor: getButtonColor(0) }}
                    >
                        {currentQuestion.options[0] !== null ? (
                            <>
                                <span>A:</span> {currentQuestion.options[0]}
                            </>
                        ) : null}
                    </button>
                    <button
                        className="option"
                        onClick={() => handleAnswer(1)}
                        style={{ backgroundColor: getButtonColor(1) }}
                    >
                        {currentQuestion.options[1] !== null ? (
                            <>
                                <span>B:</span> {currentQuestion.options[1]}
                            </>
                        ) : null}
                    </button>
                </div>
                <div className="options">
                    <button
                        className="option"
                        onClick={() => handleAnswer(2)}
                        style={{ backgroundColor: getButtonColor(2) }}
                    >
                        {currentQuestion.options[2] !== null ? (
                            <>
                                <span>C:</span> {currentQuestion.options[2]}
                            </>
                        ) : null}
                    </button>
                    <button
                        className="option"
                        onClick={() => handleAnswer(3)}
                        style={{ backgroundColor: getButtonColor(3) }}
                    >
                        {currentQuestion.options[3] !== null ? (
                            <>
                                <span>D:</span> {currentQuestion.options[3]}
                            </>
                        ) : null}
                    </button>
                </div>
            </div>
            <div className="help_container">
                <button className="help" onClick={handlefiftyFifty} disabled={isHelpUsed.fiftyFifty}>50/50</button>
                <button className="help" onClick={handleHallHelp} disabled={isHelpUsed.hallHelp}>Hall help</button>
            </div>
            <div className="round_amount">
                {prizeAmount} AMD
            </div>
            <div className="round_sound_container">
                <div className="round_container">{Math.min(correctAnswerCount + 1, 12)}/12</div>
                <Button type="primary" onClick={exitGame}>Exit</Button>
                <div className="sound-_toggle" onClick={toggleMusic}>{isMusicOn ? <SoundOutlined className="sound_icon" /> : <MutedOutlined className="sound_icon" />}</div>
            </div>

            <GameEndModal
                isOpen={isGameEndModalOpen}
                message={gameEndMessage}
                onRetry={resetGame}
                onExit={exitGame}
            />
        </div>
    )
}

export default MainGame