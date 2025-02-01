import React, { useState } from "react";
import {FiCheckCircle, FiLoader} from "react-icons/fi";
import {z, ZodError} from "zod";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type RoleType = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_SPECIALIST";

interface CreateAccountDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: RoleType;
}

interface Props {
    onSubmit: (data: CreateAccountDTO) => void;
}

const CreateAccountForm: React.FC<Props> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<CreateAccountDTO>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ROLE_USER",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});


    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const CreateAccountSchema = z.object({
        firstName: z
            .string()
            .min(2, { message: "Imię musi mieć od 2 do 50 znaków" })
            .max(50, { message: "Imię musi mieć od 2 do 50 znaków" })
            .nonempty({ message: "Imię nie może być puste" }),

        lastName: z
            .string()
            .min(2, { message: "Nazwisko musi mieć od 2 do 50 znaków" })
            .max(50, { message: "Nazwisko musi mieć od 2 do 50 znaków" })
            .nonempty({ message: "Nazwisko nie może być puste" }),

        email: z
            .string()
            .email({ message: "Nieprawidłowy format adresu email" })
            .nonempty({ message: "Email nie może być pusty" }),

        password: z
            .string()
            .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" })
            .regex(/[A-Z]/, { message: "Hasło musi zawierać co najmniej jedną wielką literę" })
            .regex(/[0-9]/, { message: "Hasło musi zawierać co najmniej jedną cyfrę" })
            .regex(/[\W_]/, { message: "Hasło musi zawierać co najmniej jeden znak specjalny" })
            .nonempty({ message: "Hasło nie może być puste" }),

        role: z.enum(["ROLE_USER", "ROLE_SPECIALIST", "ROLE_ADMIN"]).optional(),
    });




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'firstName') {
            try {
                CreateAccountSchema.pick({firstName: true}).parse({firstName: value}); // Validate email only
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
                CreateAccountSchema.pick({lastName: true}).parse({lastName: value}); // Validate email only
                setValidationErrors(prev => ({...prev, lastName: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, lastName: message}));
                }
            }
        }
        else if (name === 'email') {
            try {
                CreateAccountSchema.pick({email: true}).parse({email: value}); // Validate email only
                setValidationErrors(prev => ({...prev, email: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, email: message}));
                }
            }
        }
        else if (name === 'password') {
            try {
                CreateAccountSchema.pick({password: true}).parse({password: value}); // Validate email only
                setValidationErrors(prev => ({...prev, password: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, password: message}));
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Walidacja formularza za pomocą Zod
        try {
            setError(null);
            setLoading(true);
            await CreateAccountSchema.parseAsync(formData); // Asynchronous validation
            onSubmit(formData); // Przesyłanie danych na sukcesie
        } catch (err) {
            if (err instanceof z.ZodError) {
                setLoading(false);
                setError(err.errors[0].message); // Ustawienie błędu, jeśli wystąpi walidacja
            }
        }
    };

    return (

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <ToastContainer />
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* First Name */}
            <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    Imię <span className="text-red-500 ml-1 text-2xl">*</span>
                </label>

                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                />
                {validationErrors.firstName && <p className="text-red-500 text-sm">{validationErrors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Nazwisko <span className="text-red-500 ml-1 text-2xl">*</span>
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                />
                {validationErrors.lastName && <p className="text-red-500 text-sm">{validationErrors.lastName}</p>}

            </div>

            {/* Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email <span className="text-red-500 ml-1 text-2xl">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                />
                {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}

            </div>

            {/* Password */}
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Hasło <span className="text-red-500 ml-1 text-2xl">*</span>
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                />
                {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}

            </div>

            {/* Role */}
            <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                    Rola <span className="text-red-500 ml-1 text-2xl">*</span>
                </label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-500"
                >
                    <option value="ROLE_USER">Użytkownik</option>
                    <option value="ROLE_SPECIALIST">Specjalista</option>
                    <option value="ROLE_ADMIN">Administrator</option>
                </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-red-500 text-white p-4 rounded-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <FiLoader className="animate-spin text-2xl"/>
                    ) : (
                        <FiCheckCircle className="text-2xl"/>
                    )}
                </button>

            </div>
        </form>
    );
};

export default CreateAccountForm;
