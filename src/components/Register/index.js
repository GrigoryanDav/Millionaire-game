import { Input, Form, Button, Flex } from "antd";
import AuthWrapper from "../AuthWrapper";
import registerBanner from '../../core/images/auth-register.jpg'
import { Link } from "react-router-dom";
import { ROUTE_CONSTANTS } from "../../core/utils/constants";

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

                <Flex justify="flex-end" align="center" gap='10px'>
                    <Link to={ROUTE_CONSTANTS.LOGIN}>Sign In</Link>

                    <Button>
                        Sign Up
                    </Button>
                </Flex>
            </Form>
        </AuthWrapper>
    )
}

export default Register