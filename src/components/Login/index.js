import AuthWrapper from "../AuthWrapper"
import { Form, Input, Button, Flex } from 'antd'
import loginBanner from '../../core/images/auth-login.jpg'
import { Link } from "react-router-dom"
import { ROUTE_CONSTANTS } from "../../core/utils/constants"



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

               <Flex align="center" justify="flex-end" gap='10px'>
                <Link to={ROUTE_CONSTANTS.REGISTER}>Create account</Link>

               <Button type="primary" htmlType="submit">
                    Sign In
                </Button>
               </Flex>
            </Form>
        </AuthWrapper>
    )
}

export default Login