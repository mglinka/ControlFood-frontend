// SessionTimeout.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SessionTimeout: React.FC = () => {
    const { token, refreshToken, logout } = useAuth();
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (!token ) return;

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const tokenExpiration = decodedToken.exp * 1000;
        const warningTime = tokenExpiration - 14 * 60 * 1000; // 14 minutes before expiration

        const warningTimer = setTimeout(() => setShowWarning(true), warningTime - Date.now());
        const timeoutTimer = setTimeout(logout, tokenExpiration - Date.now());

        return () => {
            clearTimeout(warningTimer);
            clearTimeout(timeoutTimer);
        };
    }, [token, logout]);

    const handleRefresh = async () => {
        await refreshToken();
        setShowWarning(false);
    };

    return (
        showWarning ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center border border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your session is about to expire</h2>
                    <p className="mb-6 text-gray-700">Would you like to extend it?</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
                        >
                            Refresh Session
                        </button>
                        <button
                            onClick={logout}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default SessionTimeout;
