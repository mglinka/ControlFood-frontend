import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changeRole, getAllAccounts, getRoles } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSpinner } from "@fortawesome/free-solid-svg-icons";

type GetAccount = components["schemas"]["GetAccountDTO"];
type Role = components["schemas"]["RoleDTO"];

const AccessLevelsPage: React.FC = () => {
    const [accessLevels, setAccessLevels] = useState<Role[]>([]);
    const [accounts, setAccounts] = useState<GetAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const fetchAccessLevels = async () => {
        setLoading(true);
        setError(null);
        try {
            const levelsResponse = await getRoles();
            setAccessLevels(levelsResponse);

            const accountsResponse = await getAllAccounts();
            const accountsWithRoleNames = accountsResponse.map((account: GetAccount) => {
                const role = levelsResponse.find((level: Role) => level.id === account.role);
                return {
                    ...account,
                    roleName: role ? role.name : "Unknown Role",
                };
            });
            setAccounts(accountsWithRoleNames);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async () => {
        if (!selectedAccountId || !selectedRole) {
            toast.error('Wybierz rolę');
            return;
        }

        try {
            await changeRole(selectedAccountId, selectedRole);

            await fetchAccessLevels();

            toast.success('Poziom dostępu został zmieniony pomyślnie');
            setIsModalOpen(false);
            setSelectedRole(null);
        } catch (err: any) {
            if (err?.response) {
                console.error('Błąd API:', err.response.data);

                if (err.response.status === 400) {
                    setIsModalOpen(false);
                }

                if (err.response.data?.message) {
                    toast.error(`${err.response.data.message}`);
                } else {
                    toast.error('Wystąpił nieoczekiwany błąd przy zmianie roli.');
                }
            } else {
                toast.error('Wystąpił błąd połączenia z serwerem.');
            }
        }
    };

    const handleOpenModal = (accountId: string) => {
        setSelectedAccountId(accountId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const handleRoleSelection = (roleId: string) => {
        setSelectedRole(roleId);
    };

    useEffect(() => {
        fetchAccessLevels();
    }, []);

    return (
        <div className="bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 mt-12">Zarządzaj poziomami dostępu</h1>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <>
                        {accounts && accounts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {accounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col min-h-[200px] relative transition-transform hover:scale-105"
                                    >
                                        {/* Icon in the top right corner */}
                                        <button
                                            className="absolute top-2 right-2 text-red-600 w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-600 hover:bg-gray-100 transition"
                                            onClick={() => handleOpenModal(account.id as string)}
                                        >
                                            <FontAwesomeIcon icon={faSlidersH} size="lg"/>
                                        </button>


                                        {/* Name */}
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{account.firstName} {account.lastName}</h3>

                                        {/* Access level */}
                                        <h3 className="text-md sm:text-lg font-medium text-gray-600 mt-12">Poziom dostępu:</h3>

                                        <p className="text-red-700 mt-2 font-bold">
                                            {account.role === 'USER' ? 'Użytkownik' :
                                                account.role === 'SPECIALIST' ? 'Specjalista' :
                                                    account.role === 'ADMIN' ? 'Administrator' : account.role}
                                        </p>
                                        <div className="text-center mt-6">
                                            {/* Optional additional button or content */}
                                            {/* <button className="bg-blue-500 text-white py-1 px-3 rounded-lg">Some action</button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Brak dostępnych kont</p>
                        )}


                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-black opacity-50 absolute inset-0" onClick={handleCloseModal}></div>
                                <div
                                    className="bg-white p-6 rounded-lg shadow-md z-10 max-w-md w-full mx-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Zmień poziom dostępu</h2>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Wybierz nową rolę</label>
                                        <div>
                                            {accessLevels.map((level) => (
                                                level.id ? (
                                                    <div key={level.id} className="mb-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="role"
                                                                value={level.id}
                                                                checked={selectedRole === level.id}
                                                                onChange={() => handleRoleSelection(level.id as string)}
                                                                className="mr-2"
                                                            />
                                                            {level.name === 'USER' ? 'Użytkownik' :
                                                                level.name === 'SPECIALIST' ? 'Specjalista' :
                                                                    level.name === 'ADMIN' ? 'Administrator' : level.name}
                                                        </label>
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 mr-2"
                                            onClick={handleCloseModal}
                                        >
                                            Anuluj
                                        </button>
                                        <button
                                            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                                            onClick={handleRoleChange}
                                        >
                                            Zapisz zmiany
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <ToastContainer/>
            </div>
        </div>

    );
};

export default AccessLevelsPage;
