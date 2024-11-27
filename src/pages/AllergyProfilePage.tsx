import React, { useState, useEffect } from "react";
import { authService } from "../utils/authService.ts";
import axiosInstance from "../api/axiosConfig.ts";
import { ToastContainer } from "react-toastify";
import UserProfileSchemas from "../components/UserProfileSchemas.tsx";
import CustomProfile from "../components/CustomProfile.tsx";

const AllergyProfilePage: React.FC = () => {
    const [hasProfile, setHasProfile] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // State for loading
    const [isSchemaView, setIsSchemaView] = useState<boolean>(false); // Control schema view
    const [isCustomProfileView, setIsCustomProfileView] = useState<boolean>(false); // Control custom profile view

    // Fetch allergy profile data
    const fetchAllergyProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available.");
            }
            const response = await axiosInstance.get(`/allergy-profiles/byAccount/${accountId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const loadProfileData = async () => {
        try {
            const allergyProfile = await fetchAllergyProfile();
            setHasProfile(!!allergyProfile?.allergens); // Check if the profile has allergens
        } catch {
            setHasProfile(false); // If no profile, set as false
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    };

    useEffect(() => {
        loadProfileData(); // Load profile data on first render
    }, []);

    const handleStartWithSchemas = () => {
        setIsSchemaView(true); // Switch to schema view
        setIsCustomProfileView(false); // Ensure custom profile is not active
    };

    const handleStartWithCustomProfile = () => {
        setIsCustomProfileView(true); // Switch to custom profile view
        setIsSchemaView(false); // Ensure schema view is not active
    };

    const handleBackToButtons = () => {
        setIsSchemaView(false); // Go back to button view
        setIsCustomProfileView(false); // Disable custom profile view
    };

    const handleProfileAssigned = () => {
        // Callback function to update profile status after assignment
        setHasProfile(true); // Profile has been assigned
        setIsSchemaView(false); // Close schema view after assignment
        setIsCustomProfileView(true); // Open custom profile view after assignment
    };

    return (
        <div className="p-6 md:p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Profil alergiczny</h1>

            {/* Show loading indicator while waiting for data */}
            {loading && (
                <div className="text-center">
                    <p className="text-xl mb-4">Loading allergy profile...</p>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {/* Show buttons if no profile and data is loaded */}
            {!loading && !hasProfile && !isSchemaView && !isCustomProfileView && (
                <div className="text-center">
                    <p className="text-xl mb-6">
                        Would you like to select a template or create your own allergy profile?
                    </p>
                    <div
                        className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 mt-4 justify-center items-center">
                        {/* Button 1 - Select Template */}
                        <button
                            onClick={handleStartWithSchemas}
                            className="relative bg-white w-48 h-16 hover:bg-gray-100 text-black border-2 border-black rounded-full shadow-lg transition-transform transform hover:scale-105"
                        >
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                Select Template
            </span>
                        </button>

                        {/* Button 2 - Create Custom Profile */}
                        <button
                            onClick={handleStartWithCustomProfile}
                            className="relative bg-white w-48 h-16 hover:bg-gray-100 text-black border-2 border-black rounded-full shadow-lg transition-transform transform hover:scale-105"
                        >
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                Create Custom Profile
            </span>
                        </button>
                    </div>
                </div>

            )}

            {/* Render UserProfileSchemas if schema view is active */}
            {isSchemaView && !loading && !hasProfile && (
                <UserProfileSchemas onBack={handleBackToButtons} onProfileAssigned={handleProfileAssigned}/>
            )}

            {/* Render CustomProfile if custom profile view is active */}
            {isCustomProfileView && (
                <CustomProfile onBack={handleBackToButtons}/>
            )}

            {/* If the user has a profile, show the CustomProfile directly */}
            {hasProfile && !isSchemaView && !isCustomProfileView && (
                <CustomProfile onBack={handleBackToButtons}/>
            )}

            <ToastContainer/>
        </div>
    );
};

export default AllergyProfilePage;
