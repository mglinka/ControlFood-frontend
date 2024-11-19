import React, { useState, useEffect } from 'react';
import { useAuth } from "../utils/AuthContext.tsx";
import { authService } from "../utils/authService.ts";
import { changePassword, updateAccountInfo, getAccountInfo } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type GetAccountDTO = components["schemas"]["GetAccountDTO"];

const MyAccountPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [accountInfo, setAccountInfo] = useState<GetAccountDTO | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false); // Toggle for update form
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { role } = useAuth();

    const handleGetAccountInfo = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }
            const data = await getAccountInfo(accountId);
            setAccountInfo(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
        } catch (err: any) {
            console.error('Error fetching account info:', err);
            toast.error('Failed to load account information.');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await updateAccountInfo({ firstName, lastName });
            toast.success('Profile updated successfully!');
            setIsEditingProfile(false); // Hide the form after updating
            await handleGetAccountInfo(); // Refresh account info
        } catch (err: any) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'An error occurred while updating the profile.');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        try {
            await changePassword({
                currentPassword,
                newPassword,
                confirmationPassword: confirmPassword,
            });
            toast.success('Password changed successfully!');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (err: any) {
            console.error('Password change error:', err);
            toast.error(err.response?.data?.message || 'An error occurred while changing the password.');
        }
    };

    useEffect(() => {
        handleGetAccountInfo();
    }, []);

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-4xl sm:text-5xl">👤</span>
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Użytkownik</h1>
                <p className="text-gray-500 text-xs sm:text-sm">{authService.getAccountEmail()}</p>
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

            {isEditingProfile ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Edit Profile</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-md shadow-sm hover:from-orange-400 hover:to-red-400"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-md shadow-sm hover:from-orange-400 hover:to-red-400"
                    >
                        Edit Profile
                    </button>
                </div>
            )}

            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 sm:p-10 mt-6">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                    Change Password
                </h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Current Password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-orange-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleChangePassword}
                        className="flex w-full justify-center rounded-md bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:from-orange-400 hover:to-red-400"
                    >
                        Change Password
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MyAccountPage;
