import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changeRole, getAllAccounts, getRoles } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";

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
            const accountsWithRoleNames = accountsResponse.map((account:GetAccount) => {
                const role = levelsResponse.find((level:Role) => level.id === account.role);
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
            toast.error('Please select a role.');
            return;
        }

        try {
            await changeRole(selectedAccountId, selectedRole);

            await fetchAccessLevels();

            toast.success('Access level updated successfully.');
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
        <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Manage Access Levels</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading data...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    {accounts && accounts.length > 0 ? (
                        <table className="min-w-full bg-white rounded-lg shadow mb-6">
                            <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="py-2 px-4 text-left">Account Name</th>
                                <th className="py-2 px-4 text-left">Current Role</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id} className="border-b">
                                    <td className="py-2 px-4">{account.firstName} {account.lastName}</td>
                                    <td className="py-2 px-4">{account.role}</td> {/* Show role name */}
                                    <td className="py-2 px-4 text-center">
                                        <button
                                            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                                            onClick={() => handleOpenModal(account.id as string)}
                                        >
                                            Change Access Level
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500">No accounts available.</p>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-black opacity-50 absolute inset-0" onClick={handleCloseModal}></div>
                            <div className="bg-white p-6 rounded-lg shadow-md z-10 max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">Change Access Level</h2>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Select New Role</label>
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
                                                        {level.name}
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
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                                        onClick={handleRoleChange}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <ToastContainer />
        </div>
    );
};

export default AccessLevelsPage;
