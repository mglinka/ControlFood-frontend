import React, { useState } from "react";
import { registerUser } from "../api.ts";
import axios from "axios";
import MainHeader from "../MainHeader.tsx";
import {LoginForm} from "../forms/LoginForm.tsx";
import {RegisterForm} from "../forms/RegisterForm.tsx";

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await registerUser(firstName, lastName, email, password);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {

                console.error(error.response.data.message);
            }
        }
    };

    return (
        <>
            <MainHeader />
            <RegisterForm/>
        </>
    );
};

export default RegisterPage;
