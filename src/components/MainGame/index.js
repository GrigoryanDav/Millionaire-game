import { questionsArray, ROUTE_CONSTANTS } from "../../core/utils/constants"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import GameEndModal from "../GameEndModal"
import './index.css'

const getRandomIndex = (array) => Math.floor(Math.random() * array.length)

const MainGame = () => {
    const [remainingQuestions, setRemainingQuestions] = useState([...questionsArray])
    const [currentQuestion, setCurrentQuestion] = useState(questionsArray[getRandomIndex(remainingQuestions)])
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
    const [prizeAmount, setPrizeAmount] = useState(500)
    const [isHelpUsed, setIsHelpUsed] = useState({ hallHelp: false, fiftyFifty: false })
    const [isGameEndModalOpen, setIsGameEndModalOpen] = useState(false)
    const [gameEndMessage, setGameEndMessage] = useState('')

    const navigate = useNavigate()
    const fixedWinningMoney = [8000, 32000, 128000]

    const getFixedWinningAmount = (prizeAmount) => {
        for (let i = fixedWinningMoney.length - 1; i >= 0; i--) {
            if (prizeAmount >= fixedWinningMoney[i]) {
                return fixedWinningMoney[i]
            }
        }
        return 0
    }

    const handleAnswer = (selectedIndex) => {
        if (selectedIndex === currentQuestion.correctAnswer) {
            const newCorrectAnswerCount = correctAnswerCount + 1
            setCorrectAnswerCount(newCorrectAnswerCount)
            const newPrizeAmount = Math.min(prizeAmount * 2, 1000000)
            setPrizeAmount(newPrizeAmount)

            
            if (newCorrectAnswerCount === 12) {
                setGameEndMessage(`Congratulations! You won ${prizeAmount} AMD`)
                setIsGameEndModalOpen(true)
                return;
            }

            moveToNextQuestion()

        } else {
            const winningAmount = getFixedWinningAmount(prizeAmount)
            setGameEndMessage(`Wrong answer! You won ${winningAmount} AMD. Try again!`)
            setIsGameEndModalOpen(true)
            return;
        }
    }

    const moveToNextQuestion = () => {
        const newRemainingQuestions = remainingQuestions.filter(q => q !== currentQuestion)
        setRemainingQuestions(newRemainingQuestions)
        setCurrentQuestion(newRemainingQuestions[getRandomIndex(newRemainingQuestions)])
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
            console.log(remainingIncorrectIndex)
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

    const resetGame = () => {
        setRemainingQuestions([...questionsArray])
        setCurrentQuestion(questionsArray[getRandomIndex(questionsArray)])
        setCorrectAnswerCount(0)
        setPrizeAmount(500)
        setIsHelpUsed({ hallHelp: false, fiftyFifty: false })
        setIsGameEndModalOpen(false)
    }

    const exitGame = () => {
        navigate(ROUTE_CONSTANTS.HOMEPAGE)
    }

    return (
        <div className="game_container">
            <div className="question_title">{currentQuestion.question}</div>
            <div className="options_container">
                <div className="options">
                    <button className="option" onClick={() => handleAnswer(0)}>
                        {currentQuestion.options[0] !== null ? (
                            <>
                                <span>A:</span> {currentQuestion.options[0]}
                            </>
                        ) : null}
                    </button>
                    <button className="option" onClick={() => handleAnswer(1)}>
                        {currentQuestion.options[1] !== null ? (
                            <>
                                <span>B:</span> {currentQuestion.options[1]}
                            </>
                        ) : null}
                    </button>
                </div>
                <div className="options">
                    <button className="option" onClick={() => handleAnswer(2)}>
                        {currentQuestion.options[2] !== null ? (
                            <>
                                <span>C:</span> {currentQuestion.options[2]}
                            </>
                        ) : null}
                    </button>
                    <button className="option" onClick={() => handleAnswer(3)}>
                        {currentQuestion.options[3] !== null ? (
                            <>
                                <span>D:</span> {currentQuestion.options[3]}
                            </>
                        ) : null}
                    </button>
                </div>
                <div className="help_container">
                    <button className="help" onClick={handlefiftyFifty} disabled={isHelpUsed.fiftyFifty}>50/50</button>
                    <button className="help" onClick={handleHallHelp} disabled={isHelpUsed.hallHelp}>Hall help</button>
                </div>
                <div className="round_amount">
                    {prizeAmount} AMD
                </div>
                <div className="round_container">{correctAnswerCount + 1}/12</div>
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