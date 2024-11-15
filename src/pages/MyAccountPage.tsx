import React, { useState, useEffect } from 'react';
import { useAuth } from "../utils/AuthContext.tsx";
import { authService } from "../utils/authService.ts";
import { changePassword } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { getAccountInfo } from "../api/api.ts"; // Import the new API function
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

type GetAccountDTO = components["schemas"]["GetAccountDTO"];

const MyAccountPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [accountInfo, setAccountInfo] = useState<GetAccountDTO | null>(null); // State for account info
    const { role } = useAuth();

    const handleGetAccountInfo = async () => {
        try {
            const accountId = authService.getAccountId();
            console.log("Start", accountId);
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }
            const data = await getAccountInfo(accountId); // Assuming authService has getAccountId method
            console.log("Dalej", data);
            setAccountInfo(data); // Set the account info state
        } catch (err: any) {
            console.error('Error fetching account info:', err);
            setError('Failed to load account information.');
            toast.error('Failed to load account information.');  // Show error toast
        }
    };

    const handleUpdateProfile = () => {
        setMessage('Profile updated successfully!');
        toast.success('Profile updated successfully!');  // Success toast for profile update
    };

    const handleChangePassword = async () => {
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            toast.error('Passwords do not match!');  // Error toast
            return;
        }

        try {
            await changePassword({
                currentPassword,
                newPassword,
                confirmationPassword: confirmPassword,
            });
            setMessage('Password changed successfully!');
            toast.success('Password changed successfully!');  // Success toast for password change
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (err: any) {
            console.error('Password change error:', err);
            setError(err.response?.data?.message || 'An error occurred while changing the password.');
            toast.error(err.response?.data?.message || 'An error occurred while changing the password.');  // Error toast for password change
        }
    };

    // Fetch account information when the component mounts
    useEffect(() => {
        handleGetAccountInfo();
    }, []);

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

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Account Information</h2>
                {accountInfo ? (
                    <>
                        <p className="text-sm sm:text-base"><strong>Role:</strong> {role}</p>
                        <p className="text-sm sm:text-base"><strong>Email:</strong> {accountInfo.email}</p>
                        <p className="text-sm sm:text-base"><strong>First Name:</strong> {accountInfo.firstName}</p>
                        <p className="text-sm sm:text-base"><strong>Last Name:</strong> {accountInfo.lastName}</p>
                    </>
                ) : (
                    <p className="text-sm sm:text-base text-gray-500">Loading account information...</p>
                )}
            </div>

            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 sm:p-10 mt-6">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                    Profile Settings
                </h2>
                <form className="space-y-6">
                    <div>
                        <button
                            type="button"
                            onClick={handleUpdateProfile}
                            className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:from-red-400 hover:to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 sm:p-10 mt-6">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                    Change Password
                </h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Current Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                            New Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleChangePassword}
                            className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:from-red-400 hover:to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
                {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
            </div>

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default MyAccountPage;
