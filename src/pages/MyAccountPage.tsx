import React, { useState } from 'react';
import {useAuth} from "../utils/AuthContext.tsx";

const MyAccountPage: React.FC = () => {
    const [username, setUsername] = useState('JohnDoe'); // Replace with actual user data
    const [email, setEmail] = useState('johndoe@example.com'); // Replace with actual user data
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [message, setMessage] = useState('');

    const {user} = useAuth();
    const handleUpdateProfile = () => {
        // Logic to update profile (e.g., call an API)
        console.log('Updating profile:', { username, email });
        setMessage('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        // Logic to change password (e.g., call an API)
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }
        console.log('Changing password to:', newPassword);
        setMessage('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="p-10 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">My Account</h1>

            {/* Account Information Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
                <p className="mb-2"><strong>Username:</strong> {user?.sub}</p>
                <p className="mb-2"><strong>Email:</strong> {email}</p>

            </div>

            {/* Profile Settings Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Update Profile
                </button>
            </div>

            {/* Change Password Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    onClick={handleChangePassword}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                    Change Password
                </button>
            </div>

            {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        </div>
    );
};

export default MyAccountPage;
