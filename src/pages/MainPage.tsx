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

            <div className="z-10 flex flex-col items-start p-6 space-y-10 w-[45vw] absolute right-0 top-[55%]">
                {/* First Box: Browse Products */}
                <div className="h-[160px] mt-16 w-full p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4">
                    {role === "ROLE_ADMIN" ? (
                        <MdAdminPanelSettings size={40} className="text-gray-800" />
                    ) : (
                        <MdShoppingCart size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Browse Products</h3>
                        <p className="text-gray-600">
                            {role === "ROLE_ADMIN" ? (
                                <>As an admin, you can manage the product inventory and access exclusive features.</>
                            ) : role === "ROLE_USER" || role === "ROLE_SPECIALIST" ? (
                                <>Explore a wide variety of products tailored to your needs and preferences.</>
                            ) : (
                                <>Welcome! Explore our product catalog.</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Second Box: Create and Edit Allergy Profile */}
                <div className="h-[160px] w-full p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4">
                    {role === "ROLE_SPECIALIST" ? (
                        <MdPersonAdd size={40} className="text-gray-800" />
                    ) : (
                        <MdPerson size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Create and Edit Allergy Profile</h3>
                        <p className="text-gray-600">
                            {role === "ROLE_ADMIN" ? (
                                <>Admins can view and manage all profiles.</>
                            ) : role === "ROLE_USER" ? (
                                <>Manage your own allergy profile to align products with your health needs.</>
                            ) : role === "ROLE_SPECIALIST" ? (
                                <>Assist users in creating and managing their allergy profiles for better recommendations.</>
                            ) : (
                                <>Personalize your experience by setting up an allergy profile.</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Third Box: Scan EAN Code */}
                <div className="h-[160px] w-full p-8 bg-white bg-opacity-80 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center space-x-4">
                    {role === "ROLE_ADMIN" ? (
                        <MdSettings size={40} className="text-gray-800" />
                    ) : (
                        <MdQrCodeScanner size={40} className="text-gray-800" />
                    )}
                    <div className="flex-1">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Scan EAN Code</h3>
                        <p>
                            {role === "ROLE_ADMIN" ? (
                                <>Admins can configure system settings and manage operations.</>
                            ) : role === "ROLE_USER" || role === "ROLE_SPECIALIST" ? (
                                <>Quickly scan product codes for instant details.</>
                            ) : (
                                <>Use our scanner to streamline your shopping experience.</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
