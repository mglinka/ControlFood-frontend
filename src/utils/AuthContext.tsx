// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService'; // Adjust the path as needed

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
    refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            const decoded = authService.decodeToken(token);
            if (decoded) {
                setRole(decoded.role[0]);
            }
        }
    }, [token]);

    const login = (token: string) => {
        const decoded = authService.decodeToken(token);
        if (decoded) {
            setRole(decoded.role[0]);
        }
        setToken(token);
        localStorage.setItem('token', token);
    };


    const refreshToken = async () => {
        try {
            const newToken = await authService.refreshToken();
            if (newToken) {
                setToken(newToken);
                return newToken;
            }
            return null;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logout(); // Optionally log out on refresh failure
            return null;
        }
    };
    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
    };



    return (
        <AuthContext.Provider value={{ token, role, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
