import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig.ts';
import { jwtDecode } from 'jwt-decode';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../utils/toastify.css';
import { useAuth } from '../utils/AuthContext.tsx';
import { GoogleLogin } from '@react-oauth/google';
import { AmazonRegisterButton } from './AmazonRegisterButton.tsx';
import { z, ZodError } from 'zod';
import {FaSpinner} from "react-icons/fa";

const registerSchema = z.object({
    firstName: z.string().min(2, "Imię jest wymagane"),
    lastName: z.string().min(2, "Nazwisko jest wymagane"),
    email: z.string().email("Niepoprawny adres email"),
    password: z.string()
        .min(8, "Hasło musi mieć co najmniej 8 znaków")
        .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
        .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
        .regex(/[\W_]/, "Hasło musi zawierać co najmniej jeden znak specjalny")
});

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export function RegisterForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterRequest((prev) => ({ ...prev, [name]: value }));

        if (name === 'email') {
            try {
                registerSchema.pick({email: true}).parse({email: value}); // Validate email only
                setValidationErrors(prev => ({...prev, email: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, email: message}));
                }
            }
        } else if (name === 'password') {
            try {
                registerSchema.pick({password: true}).parse({password: value});
                setValidationErrors(prev => ({...prev, password: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message;
                    setValidationErrors(prev => ({...prev, password: message}));
                }
            }
        }else if (name === 'firstName') {
            try {
                registerSchema.pick({firstName: true}).parse({firstName: value});
                setValidationErrors(prev => ({...prev, firstName: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, firstName: message}));
                }
            }
        }
        else if (name === 'lastName') {
                try {
                    registerSchema.pick({lastName: true}).parse({lastName: value});
                    setValidationErrors(prev => ({...prev, lastName: undefined}));
                } catch (error) {
                    if (error instanceof ZodError) {
                        const message = error.errors[0].message;
                        setValidationErrors(prev => ({...prev, lastName: message}));
                    }
                }
            }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const result = registerSchema.safeParse(registerRequest);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            setValidationErrors({
                firstName: errors.firstName?.[0] || '',
                lastName: errors.lastName?.[0] || '',
                email: errors.email?.[0] || '',
                password: errors.password?.[0] || ''
            });
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/auth/register', registerRequest);
            toast.success('Na Twój adres e-mail został wysłany link aktywacyjny do konta');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: any) {
            const message = error.response?.data?.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const token = credentialResponse.credential;
            const userInfo: any = jwtDecode(token);
            console.log(userInfo)
            const response = await axiosInstance.post('/auth/google/redirect', token);
            login(response.data.token);

            toast.success('Logowanie przez Google powiodło się');
            setTimeout(() => navigate('/main-page'), 700);
        } catch (error: any) {
            console.error('Google Login Error:', error);
            toast.error('Logowanie przez Google nie powiodło się');
        }
    };

    const handleGoogleFailure = (): any => {
        toast.error('Logowanie przez Google nie powiodło się');
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="rounded-lg border border-gray-300 p-8 shadow-lg mt-12">
                    <div className="mx-auto h-10 w-auto flex justify-center items-center">
                        <FontAwesomeIcon icon={faUserCircle} size="3x" className="text-red-500" />
                    </div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                        Stwórz konto
                    </h2>


                    <div className="mt-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="firstName"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    Imię
                                    <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                                </label>

                                <div className="mt-2">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        autoComplete="given-name"
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                    {validationErrors.firstName &&
                                        <p className="text-red-500 text-sm">{validationErrors.firstName}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Nazwisko
                                    <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={registerRequest.lastName}
                                    onChange={handleChange}
                                    className="block w-full rounded-md py-2 text-gray-900"
                                />
                                {validationErrors.lastName &&
                                    <p className="text-red-500 text-sm">{validationErrors.lastName}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                    <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                    {validationErrors.email &&
                                        <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 ">
                                    Hasło<span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                    {validationErrors.password &&
                                        <p className="text-red-500 text-sm">{validationErrors.password}</p>}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex w-full justify-center rounded-md ${loading ? 'bg-gray-500' : 'bg-orange-600'} px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600`}
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : "Stwórz konto"}
                                </button>
                            </div>

                            <div className="mt-6">
                                <GoogleLogin
                                    text={"signup_with"}
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleFailure}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                />
                            </div>
                            <div className="mt-6">
                                <AmazonRegisterButton/>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Już posiadasz konto?{' '}
                            <Link to="/login" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">Zaloguj
                                się</Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right"/>
        </div>
    );
}
