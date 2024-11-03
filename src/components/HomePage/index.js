import { Button } from 'antd'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { useNavigate, Outlet } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../core/utils/constants'
import gameLogo from '../../core/images/millionaire-game-logo.jpg'
import './index.css'


const HomePage = ({ userInfo }) => {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error, 'SignOut error!')
        }
    }

    const handleStart = () => {
        navigate(ROUTE_CONSTANTS.PLAY)
        console.log('navigate')
    }

    return (
        <div className="home_container">
            <div className='home_img_container' style={{ backgroundImage: `url(${gameLogo})` }}></div>
            <h2>
                Hello {userInfo.userName}․ <br />
                Test your knowledge by playing who wants to be a millionaire game.
            </h2>
            <div className='home_button_container'>
                <Button type='primary' onClick={handleStart}>Start</Button>
                <Button type='primary' onClick={handleSignOut}>Log Out</Button>
            </div>
            <Outlet />
        </div>
    )
}

export default HomePage