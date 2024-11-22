import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { components } from '../controlfood-backend-schema';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Default styles
import '../utils/toastify.css'; // Your custom styles
import { z, ZodError } from 'zod'; // Import ZodError from zod
import axiosInstance from "../api/axiosConfig.ts";
import { useAuth } from "../utils/AuthContext.tsx";

// Define Zod schema for validation
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit")
        .regex(/[\W_]/, "Password must contain at least one special character") // Matches any non-word character
});

export function LoginForm() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [authenticationRequest, setAuthenticationRequest] = useState<components["schemas"]["AuthenticationRequest"]>({
        email: '',
        password: ''
    });
    const { login } = useAuth();

    // State to hold validation error messages
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAuthenticationRequest(prev => ({ ...prev, [name]: value }));

        // Validate field dynamically on input change
        if (name === 'email') {
            try {
                loginSchema.pick({ email: true }).parse({ email: value }); // Validate email only
                setValidationErrors(prev => ({ ...prev, email: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({ ...prev, email: message }));
                }
            }
        } else if (name === 'password') {
            try {
                loginSchema.pick({ password: true }).parse({ password: value }); // Validate password only
                setValidationErrors(prev => ({ ...prev, password: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({ ...prev, password: message }));
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({}); // Clear previous validation errors

        // Validate entire form data with Zod
        const result = loginSchema.safeParse(authenticationRequest);
        if (!result.success) {
            // If validation fails, extract and set errors
            const errors = result.error.flatten().fieldErrors;
            setValidationErrors({
                email: errors.email?.[0],
                password: errors.password?.[0]
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/authenticate', authenticationRequest);
            const token = response.data;

            login(token);
            toast.success('Successfully signed in!');
            setTimeout(() => navigate('/main-page'), 1000);
        } catch (error: any) {
            const message = error.response?.data?.message;
            setErrorMessage(message);
            toast.error(message);
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
                            {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
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
                            {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
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
                    <Link to="/register" className="font-semibold leading-6 text-red-600 hover:text-red-500">Sign up here</Link>
                </p>
            </div>

            <ToastContainer position="bottom-right" /> {/* Adjust position here */}
        </div>
    );
}
