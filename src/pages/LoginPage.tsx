import React, { useState } from "react";
import MainHeader from "../MainHeader.tsx";
import axios from "axios";
import {loginUser} from "../api.ts";
import {useNavigate} from "react-router-dom";
import {LoginForm} from "../forms/LoginForm.tsx";

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();


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
