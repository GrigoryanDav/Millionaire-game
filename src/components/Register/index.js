import { Input, Form, Button, Flex } from "antd";
import AuthWrapper from "../AuthWrapper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "../../core/utils/constants";
import { useState } from "react";
import registerBanner from '../../core/images/auth-register.jpg'

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleRegister = async (values) => {
        setLoading(true)
        const { email, password } = values
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            navigate(ROUTE_CONSTANTS.LOGIN)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    return (
        <AuthWrapper title='Sign Up' banner={registerBanner}>
            <Form layout="vertical" form={form} onFinish={handleRegister}>
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

                    <Button type="primary" htmlType="submit" loading={loading}>
                        Sign Up
                    </Button>
                </Flex>
            </Form>
        </AuthWrapper>
    )
}

export default Register