import React, { useEffect, useState } from "react";
import LocalImage from "../components/LocalImage.tsx";
import { MdShoppingCart, MdPerson, MdQrCodeScanner, MdAdminPanelSettings, MdSettings, MdPersonAdd } from "react-icons/md";
import { useAuth } from "../utils/AuthContext.tsx"; // Assuming you have Auth context

const MainPage: React.FC = () => {
    const { role } = useAuth(); // Fetch the role from the auth context
    const [loading, setLoading] = useState(true); // Loading state to handle async role fetching

    useEffect(() => {
        if (role !== null) {
            console.log("User role updated:", role); // Debugging role
            setLoading(false); // Role is available, stop loading
        }
    }, [role]);

    // If role is null, render loading state (or spinner)
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative">
            <div className="absolute inset-0 z-0">
                <LocalImage />
            </div>

            <div className="z-10 flex flex-col items-start p-4 sm:p-6 lg:p-8 space-y-10 w-full sm:w-[60vw] md:w-[50vw] lg:w-[45vw] absolute right-0 top-[60%] mt-20">
                {/* First Box: Browse Products */}
                <div className="h-[160px] w-full p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                    {role === "ROLE_ADMIN" ? (
                        <MdAdminPanelSettings size={40} className="text-gray-800" />
                    ) : (
                        <MdShoppingCart size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            {role === "ROLE_ADMIN" ? "Zarządzanie kontami" : "Przeglądanie produktów"}
                        </h3>
                        <p className="text-gray-600">
                            {role === "ROLE_ADMIN" ? (
                                <>Jako administrator masz pełną odpowiedzialność za zarządzanie kontami użytkowników w systemie ControlFood.</>
                            ) : role === "ROLE_USER" ? (
                                <>Jako użytkownik, masz możliwość przeglądania szerokiej gamy produktów, które pasują do Twoich preferencji i potrzeb zdrowotnych.</>
                            ) : role === "ROLE_SPECIALIST" ? (
                                <>Jako specjalista masz możliwość nie tylko przeglądania szczegółowego katalogu produktów, ale również wzbogacania go o nowe pozycje. </>
                            ) : (
                                <>Welcome</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Second Box: Create and Edit Allergy Profile */}
                <div className="h-[160px] w-full p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                    {role === "ROLE_SPECIALIST" ? (
                        <MdPersonAdd size={40} className="text-gray-800"/>
                    ) : (
                        <MdPerson size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            {role === "ROLE_ADMIN" ? "Poziomy dostępu" : "Profil alergiczny"}
                        </h3>
                        <p className="text-gray-600">
                            {role === "ROLE_ADMIN" ? (
                                <>Zarządzaj poziomami dostępu dla poszczególnych użytkowników. Przypisuj odpowiednie role (np. użytkownik, specjalista, administrator). Dzięki temu zapewnisz prawidłowe i bezpieczne korzystanie z systemu.</>
                            ) : role === "ROLE_USER" ? (
                                <>Twórz i zarządzaj swoim profilem alergicznym, aby produkty, które wybierasz, były w pełni dostosowane do Twoich potrzeb zdrowotnych.</>
                            ) : role === "ROLE_SPECIALIST" ? (
                                <>Jako specjalista masz możliwość tworzenia dedykowanych szablonów, które użytkownicy mogą wykorzystać do szybkiego i łatwego tworzenia swoich profili alergicznych.</>
                            ) : (
                                <>Personalize your experience by setting up an allergy profile.</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Third Box: Scan EAN Code */}
                <div className="h-[160px] w-full p-6 sm:p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                    {role === "ROLE_ADMIN" ? (
                        <MdSettings size={40} className="text-gray-800" />
                    ) : (
                        <MdQrCodeScanner size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                            {role === "ROLE_ADMIN" ? "Funkcjonalności" : "Skaner kodów EAN"}
                        </h3>
                        <p className="text-gray-600">
                            {role === "ROLE_ADMIN" ? (
                                <>Jako administrator możesz blokować i odblokowywać konta użytkowników, co pozwala na kontrolowanie dostępu i zapewnienie bezpieczeństwa systemu.</>
                            ) : role === "ROLE_USER" ? (
                                <>Skanuj kody produktów, aby natychmiast uzyskać szczegółowe informacje o składnikach, alergenach i innych ważnych cechach produktu, zapewniając bezpieczeństwo i dopasowanie do Twoich potrzeb.</>
                            ) : role === "ROLE_SPECIALIST" ? (
                                <>Skorzystaj z naszego skanera, aby szybko zeskanować kody produktów i uzyskać szczegółowe informacje, które pomogą Ci w zarządzaniu profilami alergicznymi oraz tworzeniu i wykorzystywaniu spersonalizowanych szablonów alergicznych.</>
                            ) : (
                                <>Witaj na naszej platformie!</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
