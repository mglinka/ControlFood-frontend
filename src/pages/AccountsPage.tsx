import React, { useEffect, useState } from 'react';
import { getAllAccounts, enableAccount, disableAccount } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLock, faSpinner, faUnlock} from "@fortawesome/free-solid-svg-icons";

type Account = components['schemas']['GetAccountDTO'];



const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllAccounts();
            console.log(data);
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
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Zarządzaj kontami</h1>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {accounts.map(account => (
                            <div
                                key={account.id}
                                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-xl"
                            >
                                {/* Account Info */}
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{account.firstName} {account.lastName}</h3>
                                    <p className="text-sm text-gray-500 ">{account.email}</p>
                                    <p className="text-sm text-gray-500 ">
                                        {account.role === 'USER' ? 'Użytkownik' :
                                            account.role === 'SPECIALIST' ? 'Specjalista' :
                                                account.role === 'ADMIN' ? 'Administrator' : account.role}
                                    </p>
                                </div>

                                {/* Status & Button */}
                                <div className="flex items-center justify-between mt-4">
                                    {/* Status */}
                                    <span
                                        className={`py-1 px-3 rounded-full text-white font-medium ${
                                            account.enabled ? 'bg-red-500' : 'bg-gray-400'
                                        }`}
                                    >
                    {account.enabled ? 'Odblokowane' : 'Zablokowane'}
                </span>

                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => handleToggleEnabled(account.id, account.enabled)}
                                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FontAwesomeIcon
                                            icon={account.enabled ? faLock : faUnlock}
                                            className="text-xl"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


                )}

                <ToastContainer/>
            </div>
        </div>
    );
};

export default AccountsPage;
