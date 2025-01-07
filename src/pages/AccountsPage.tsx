import React, { useEffect, useState } from 'react';
import { getAllAccounts, enableAccount, disableAccount } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

type Account = components['schemas']['GetAccountDTO'];

const CircularButton: React.FC<{
    onClick: () => void;
    label: string;
    className?: string;
}> = ({ onClick, label, className }) => (
    <button
        className={`w-full max-w-[120px] py-2 bg-white border-2 border-red-600 text-red-600 rounded-full hover:border-red-600 hover:bg-gray-100 transition font-medium ${className}`}
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
            console.log(data)
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
                toast.success('Konto zostało zablokowane pomyślnie');
            } else {
                await enableAccount(accountId!);
                toast.success('Konto zostało odblokowane pomyślnie');
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
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Zarządzaj kontami</h1>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden text-sm sm:text-base">
                            <thead>
                            <tr className="bg-gray-600 text-white">
                                <th className="py-3 px-4 text-left">Imię</th>
                                <th className="py-3 px-4 text-left">Nazwisko</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Rola</th>
                                <th className="py-3 px-4 text-left">Stan konta</th>
                                <th className="py-3 px-4 text-center">Akcje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map(account => (
                                <tr key={account.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4">{account.firstName}</td>
                                    <td className="py-3 px-4">{account.lastName}</td>
                                    <td className="py-3 px-4">{account.email}</td>
                                    <td className="py-3 px-4">
                                        {account.role === 'USER' ? 'Użytkownik' : account.role === 'SPECIALIST' ? 'Specjalista' : account.role === 'ADMIN' ? 'Administrator' : account.role}
                                    </td>

                                    <td className="py-3 px-4">
                                            <span
                                                className={`inline-block py-1 px-3 rounded-full text-white font-medium ${
                                                    account.enabled
                                                        ? 'bg-red-500' // Jednolity kolor tła dla aktywnego konta
                                                        : 'bg-gray-400' // Kolor tła dla nieaktywnego konta
                                                }`}
                                            >
                                                {account.enabled ? 'Odblokowane' : 'Zablokowane'}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 text-center flex justify-center items-center gap-4">
                                        <CircularButton
                                            onClick={() => handleToggleEnabled(account.id, account.enabled)}
                                            label={account.enabled ? 'Zablokuj' : 'Odblokuj'}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <ToastContainer/>
            </div>
        </div>
    );
};

export default AccountsPage;
