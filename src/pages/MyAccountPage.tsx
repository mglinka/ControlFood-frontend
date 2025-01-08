import React, { useState, useEffect } from 'react';
import { useAuth } from "../utils/AuthContext.tsx";
import { authService } from "../utils/authService.ts";
import { changePassword, updateAccountInfo, getAccountInfo } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';  // Importujemy spinner

type GetAccountDTO = components["schemas"]["GetAccountDTO"];

const MyAccountPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountInfo, setAccountInfo] = useState<GetAccountDTO | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false); // Stan ładowania
    const { role } = useAuth();

    const handleGetAccountInfo = async () => {
        setLoading(true);
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
            toast.error('Błąd podczas ładowania informacji o koncie');
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateProfile = async () => {
        if (accountInfo) {  // Sprawdzamy, czy mamy dane konta
            const payload = {
                firstName,
                lastName,
                version: accountInfo.version,  // Dodajemy wersję do payloadu
            };

            try {
                await updateAccountInfo(payload);
                toast.success('Edycja profilu powiodła się');
                setIsEditingProfile(false);
                await handleGetAccountInfo();
            } catch (err: any) {
                console.error('Error updating profile:', err);
                toast.error(err.response?.data?.message || 'Wystąpił błąd podczas aktualizacji profilu.');
            }
        }
    };


    // Funkcja zmieniająca hasło
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Hasła nie są takie same');
            return;
        }

        try {
            await changePassword({
                newPassword,
                confirmationPassword: confirmPassword,
            });
            toast.success('Zmiana hasła powiodła się');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error('Password change error:', err);
            toast.error(err.response?.data?.message || 'An error occurred while changing the password.');
        }
    };

    // Ładowanie danych po załadowaniu komponentu
    useEffect(() => {
        handleGetAccountInfo();
    }, []);



    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4">
                    <span className="text-black text-4xl sm:text-5xl">👤</span>
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Użytkownik</h1>
                <p className="text-gray-500 text-xs sm:text-sm">{authService.getAccountEmail()}</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Informacje o koncie</h2>
                {loading ? ( // Używamy FontAwesome spinnera
                    <div className="flex justify-center py-6">
                        <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#000" />
                    </div>
                ) : accountInfo ? (
                    <>
                        <p className="text-sm sm:text-base">
                            <strong>Poziom
                                dostępu: </strong>
                            {role === 'ROLE_USER' ? 'Użytkownik' : role === 'ROLE_SPECIALIST' ? 'Specjalista' : role === 'ROLE_ADMIN' ? 'Administrator' : role}
                        </p>

                        <p className="text-sm sm:text-base"><strong>Email:</strong> {accountInfo.email}</p>
                        <p className="text-sm sm:text-base"><strong>Imię:</strong> {accountInfo.firstName}</p>
                        <p className="text-sm sm:text-base"><strong>Nazwisko:</strong> {accountInfo.lastName}</p>
                    </>
                ) : (
                    <p className="text-sm sm:text-base text-gray-500">Ładowanie...</p>
                )}
            </div>

            {/* Edycja profilu */}
            {isEditingProfile ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Edytuj profil</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Imię</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md"
                            >
                                Anuluj
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-black to-black rounded-md shadow-sm hover:from-gray-700 hover:to-gray-700"
                            >
                                Zapisz zmiany
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-black to-black shadow-sm hover:from-gray-700 hover:to-gray-700"
                    >
                        Edytuj profil
                    </button>
                </div>
            )}

            <div className="bg-white border border-gray-300 full shadow-lg p-6 sm:p-10 mt-6 rounded-lg">
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-center text-transparent rounded-full bg-clip-text bg-gradient-to-r from-black to-gray-700 mb-4">
                    Zmień hasło
                </h2>
                <form className="space-y-6">

                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Nowe hasło
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-black sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Potwierdź nowe hasło
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-black sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleChangePassword}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-black to-black rounded-full shadow-sm hover:from-gray-700 hover:to-gray-700"
                        >
                            Zmień hasło
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MyAccountPage;
