import React, { useState } from "react";
import MainHeader from "../MainHeader.tsx";
import {loginUser} from "../api.ts";
import {useNavigate} from "react-router-dom";
import {LoginForm} from "../forms/LoginForm.tsx";

const LoginPage: React.FC = () => {

    //@ts-ignore
    const [email, setEmail] = useState<string>("");
    //@ts-ignore
    const [password, setPassword] = useState<string>("");
    //@ts-ignore
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();


    //@ts-ignore
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {

            const response = await loginUser(email, password);
            console.log("Logged in successfully:", response);


            navigate("/profile");
        } catch (error) {
            setError('Invalid email or password');
            console.error('Error during login:', error);
        }
    };



    return (
        <>
        <MainHeader/>
        <LoginForm/>
           </>
    );
};

export default LoginPage;
