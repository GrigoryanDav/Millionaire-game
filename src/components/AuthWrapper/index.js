import { Typography } from "antd";
import './index.css'


const AuthWrapper = ({ title, childen, banner }) => {
    const { Title } = Typography
    return (
        <div className="auth_wrapper">
            <div className="banner_container" style={{backgroundImage: `url(${banner})`}}>

            </div>
            <div className="form_container">
                <Title level={3}> 
                    {title}
                </Title>
                {childen}
            </div>
        </div>
    )
}

export default AuthWrapper