import AuthWrapper from "../AuthWrapper"
import { Form, Input, Button } from 'antd'
import loginBanner from '../../core/images/auth-login.jpg'



const Login = () => {
    return (
        <AuthWrapper title='Sign In' banner={loginBanner}>
            <Form layout="vertical">
                <Form.Item
                label='Email'
                name='email'
                rules={[{
                    required: true,
                    message: 'Please input your Email'
                }]}
                >
                    <Input type="email" placeholder="Email" />
                </Form.Item>

                <Form.Item
                label='Password'
                name='password'
                rules={[{
                    required: true,
                    message: 'Please input your Password'
                }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Sign In
                </Button>
            </Form>
        </AuthWrapper>
    )
}

export default Login