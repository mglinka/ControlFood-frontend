import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ProtectedRouteProps {
    requiredRoles?: string[];
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
    const { token, role, refreshToken, login, isInitialized } = useAuth();

    useEffect(() => {
        const ensureRole = async () => {
            if (!token) {
                const newToken = await refreshToken(); // Odśwież token, jeśli nie jest dostępny
                if (newToken) {
                    login(newToken);
                }
            }
        };

        ensureRole();
    }, [token, refreshToken, login]);

    if (!isInitialized) {
        return <div> <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-gray-600" /></div>; // Możesz zastąpić to komponentem ładowania
    }

    if (requiredRoles && !requiredRoles.includes(role || '')) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{children}</>; // Renderuj zawartość, jeśli dostęp został przyznany
};

export default ProtectedRoute;