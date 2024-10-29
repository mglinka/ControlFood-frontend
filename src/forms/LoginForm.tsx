import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { components } from '../controlfood-backend-schema';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from '../utils/auth';
import React from 'react';
import { useAuth } from '../utils/AuthContext';

export function LoginForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [authenticationRequest, setAuthenticationRequest] = useState<components["schemas"]["AuthenticationRequest"]>({
        email: '',
        password: ''
    });
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAuthenticationRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', authenticationRequest);
            console.log(response.data);


            const token = response.data;
            const decoded = decodeToken(token);


            login(token);

            console.log('Decoded Token:', decoded);
            navigate('/profile');
        } catch (error: any) {

            setErrorMessage(error.response?.data?.message || 'Authentication failed. Please try again.');
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center py-0 lg:px-8 mt-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mx-auto flex justify-center items-center">
                    <FontAwesomeIcon icon={faKey} size="3x" className="text-red-500" />
                </div>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg border border-gray-300 rounded-lg shadow-lg p-10">
                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={authenticationRequest.email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-red-600 hover:text-red-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={authenticationRequest.password}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:from-red-400 hover:to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Register if you don't have an account{' '}
                    <a href="/register" className="font-semibold leading-6 text-red-600 hover:text-red-500">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}
