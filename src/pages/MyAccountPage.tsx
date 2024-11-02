import React, { useState } from 'react';
import { useAuth } from "../utils/AuthContext.tsx";
import { authService } from "../utils/authService.ts";

const MyAccountPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { role } = useAuth();

    const handleUpdateProfile = () => {
        setMessage('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }
        setMessage('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-4xl sm:text-5xl">👤</span>
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Użytkownik</h1>
                <p className="text-gray-500 text-xs sm:text-sm">{authService.getAccountEmail()}</p>
            </div>

            {/* Profile Actions */}
            <div className="flex justify-around mb-6">
                <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 sm:p-4">
                        <span className="text-gray-700 text-lg sm:text-xl">👤</span>
                    </div>
                    <span className="text-xs sm:text-sm mt-1 text-gray-600">Profil</span>
                </button>
                <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 sm:p-4">
                        <span className="text-green-500 text-lg sm:text-xl">📜</span>
                    </div>
                    <span className="text-xs sm:text-sm mt-1 text-gray-600"></span>
                </button>
                <button className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-3 sm:p-4">
                        <span className="text-yellow-500 text-lg sm:text-xl">🖼️</span>
                    </div>
                    <span className="text-xs sm:text-sm mt-1 text-gray-600">Moje Skany</span>
                </button>
            </div>

            {/* Account Settings */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Account Information</h2>
                <p className="text-sm sm:text-base"><strong>Username:</strong> {role}</p>
                <p className="text-sm sm:text-base"><strong>Email:</strong> {authService.getAccountEmail()}</p>
            </div>

            {/* Profile Settings Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile Settings</h2>
                <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded text-sm sm:text-base hover:bg-blue-600 transition w-full"
                >
                    Update Profile
                </button>
            </div>

            {/* Change Password Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Change Password</h2>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm sm:text-base mb-1">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm sm:text-base mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    />
                </div>
                <button
                    onClick={handleChangePassword}
                    className="bg-red-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded text-sm sm:text-base hover:bg-red-600 transition w-full"
                >
                    Change Password
                </button>
            </div>

            {/* Message */}
            {message && <p className="mt-4 text-green-500 text-center text-sm sm:text-base">{message}</p>}
        </div>
    );
};

export default MyAccountPage;
