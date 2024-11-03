import { questionsArray } from "../../core/utils/constants"
import './index.css'

const MainGame = () => {
    return (
        <div className="game_container">
            <div className="question_title">{questionsArray[0].question}</div>
            <div className="options_container">
                <div className="options">
                    <button className="option"><span>A:</span> {questionsArray[0].options[0]}</button>
                    <button className="option"><span>C:</span> {questionsArray[0].options[2]}</button>
                </div>
                <div className="options">
                    <button className="option"><span>B:</span> {questionsArray[0].options[1]}</button>
                    <button className="option"><span>D:</span> {questionsArray[0].options[3]}</button>
                </div>
            </div>
            <div className="help_container">
                <button className="help">50/50</button>
                <button className="help">Hall help</button>
            </div>
            <div className="round_container">1/10</div>
        </div>
    )
}

export default MainGame