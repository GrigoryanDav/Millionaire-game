import { Input, Form, Button, Flex, Progress } from "antd";
import AuthWrapper from "../../components/AuthWrapper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS, FIRESTORE_PATH_NAMES, regexpValidation } from "../../core/utils/constants";
import { useState } from "react";
import registerBanner from '../../core/images/auth-register.jpg'

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [passwordStrength, setPasswordStrength] = useState(0)


    const checkPasswordStrength = (value) => {
        let strength = 0
        if (value.length >= 6) strength += 20
        if (value.length >= 10) strength += 20
        if (/[A-Z]/.test(value)) strength += 20
        if (/[0-9]/.test(value)) strength += 20
        if (/[!@#$%^&*]/.test(value)) strength += 20

        setPasswordStrength(strength)
    }

    const handlePasswordChange = (e) => {
        checkPasswordStrength(e.target.value.trim())
    }

    const handleRegister = async (values) => {
        setLoading(true)
        const { userName, email, password } = values
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            const { uid } = response.user
            const createdDoc = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
            await setDoc(createdDoc, {
                uid, userName, email
            });

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
                    },
                    {
                        pattern: regexpValidation,
                        message: 'Password does not meet the criteria'
                    }]}
                >
                    <Input.Password placeholder="Password" onChange={handlePasswordChange} />
                </Form.Item>

                {
                    form.getFieldValue('password') && (
                        <Progress 
                        percent={passwordStrength}
                        showInfo={false}
                        strokeColor={
                            passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'orange' : 'green'
                        }
                        />
                    )
                }

                {

                    form.getFieldValue('password') && (
                        <p style={{color : passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'orange' : 'green'}}>
                            {
                            passwordStrength < 40 ? 'Weak password' : passwordStrength < 80 ? 'Medium password' : 'Strong Password'
                        }
                        </p>
                    )
                }

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