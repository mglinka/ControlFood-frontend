// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    exp: number;
    iat: number;
    jti: string;
    role: string[];
    sub: string;
}

interface AuthContextProps {
    user: DecodedToken | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        // Check local storage for token
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            setUser(decoded);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
