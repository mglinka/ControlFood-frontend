import React, { useEffect, useState } from 'react';
import { getAllAccounts, enableAccount, disableAccount } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Account = components['schemas']['GetAccountDTO'];

const CircularButton: React.FC<{
    onClick: () => void;
    label: string;
    className?: string;
}> = ({ onClick, label, className }) => (
    <button
        className={`w-full max-w-[120px] py-2 bg-white border border-red-500 text-red-500 rounded-full hover:border-red-600 hover:bg-red-100 transition font-medium ${className}`}
        onClick={onClick}
    >
        {label}
    </button>
);

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllAccounts();
            setAccounts(data);
        } catch (err: any) {
            console.error('Error fetching accounts:', err);
            setError('Failed to fetch accounts. Please try again later.');
            toast.error('Failed to fetch accounts.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEnabled = async (accountId: string | undefined, currentStatus: boolean | undefined) => {
        try {
            setAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.id === accountId ? { ...account, enabled: !currentStatus } : account
                )
            );

            if (currentStatus) {
                await disableAccount(accountId!);
                toast.success('Account disabled successfully.');
            } else {
                await enableAccount(accountId!);
                toast.success('Account enabled successfully.');
            }

            await fetchAccounts();
        } catch (err: any) {
            console.error('Error toggling account status:', err);
            toast.error('Failed to update account status.');
            await fetchAccounts();
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-7xl">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Manage Accounts</h1>

                {loading ? (
                    <p className="text-center text-gray-500">Loading accounts...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden text-sm sm:text-base">
                            <thead>
                            <tr className="bg-red-500 text-white">
                                <th className="py-3 px-4 text-left">First Name</th>
                                <th className="py-3 px-4 text-left">Last Name</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Role</th>
                                <th className="py-3 px-4 text-left">Enabled</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map(account => (
                                <tr key={account.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4">{account.firstName}</td>
                                    <td className="py-3 px-4">{account.lastName}</td>
                                    <td className="py-3 px-4">{account.email}</td>
                                    <td className="py-3 px-4">{account.role}</td>
                                    <td className="py-3 px-4">
                                            <span
                                                className={`inline-block py-1 px-3 rounded-full text-white font-medium ${
                                                    account.enabled
                                                        ? 'bg-red-500' // Jednolity kolor tła dla aktywnego konta
                                                        : 'bg-gray-400' // Kolor tła dla nieaktywnego konta
                                                }`}
                                            >
                                                {account.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 text-center flex justify-center items-center gap-4">
                                        <CircularButton
                                            onClick={() => handleToggleEnabled(account.id, account.enabled)}
                                            label={account.enabled ? 'Disable' : 'Enable'}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <ToastContainer />
            </div>
        </div>
    );
};

export default AccountsPage;
