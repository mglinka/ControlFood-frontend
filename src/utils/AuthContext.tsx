
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';


interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
    refreshToken: () => Promise<string | null>;
    isInitialized:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    const decoded = authService.decodeToken(storedToken);
                    if (decoded && decoded.role) {
                        setRole(decoded.role[0]);
                    }
                    setToken(storedToken);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                    localStorage.removeItem('token');
                }
            }
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            try {
                const decoded = authService.decodeToken(storedToken);  // Assuming decodeToken is a function in authService

                if (decoded && decoded.role) {
                    setRole('ols');
                }

                setToken(storedToken);  // Set the token even if role is not available
            } catch (error) {
                console.error('Failed to decode token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);  // Only run this effect once on mount

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
        console.log("Martaola1" , role );
        if (decoded) {
            setRole(decoded.role[0]);

        }
        console.log("Rola ustawiana", role)
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
            logout();
            return null;
        }
    };
    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');

    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout, refreshToken , isInitialized}}>
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
