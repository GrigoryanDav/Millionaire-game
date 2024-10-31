import { Input, Form, Button } from "antd";
import AuthWrapper from "../AuthWrapper";
import registerBanner from '../../core/images/auth-register.jpg'

const Register = () => {
    return (
        <AuthWrapper title='Sign Up' banner={registerBanner}>
            <Form layout="vertical">
                <Form.Item
                label='User Name'
                name='userName'
                rules={[{
                    required: true,
                    message: 'Please input your User Name'
                }]}
                >
                    <Input type="text" placeholder="User Name" />
                </Form.Item>

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

                <Button>
                    Sign Up
                </Button>
            </Form>
        </AuthWrapper>
    )
}

export default Register