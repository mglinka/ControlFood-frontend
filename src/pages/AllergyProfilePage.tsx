import React, { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosConfig";
import { authService } from '../utils/authService';
import { components } from "../controlfood-backend-schema";

type CreateAllergyProfileDTO = components["schemas"]["CreateAllergyProfileDTO"];
type UpdateAllergyProfileDTO = components["schemas"]["UpdateAllergyProfileDTO"];

interface Allergy {
    allergen_id: string;
    name: string;
}

interface SelectedAllergy {
    allergenId: string;
    name: string;
    intensity: string;
}

const AllergyProfilePage: React.FC = () => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [initialSelectedAllergies, setInitialSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [hasProfile, setHasProfile] = useState<boolean>(false);

    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Allergy[]>('/allergens');
            const uniqueAllergies = response.data.filter(
                (allergy, index, self) =>
                    index === self.findIndex((a) => a.allergen_id === allergy.allergen_id)
            );
            setAllergies(uniqueAllergies);
        } catch (err) {
            setError('Error fetching allergens');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllergyProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }

            const response = await axiosInstance.get(`/allergy-profiles/byAccount/${accountId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching allergy profile:", error);
            throw error;
        }
    };

    const loadProfileData = async () => {
        await fetchAllergies();
        try {
            const allergyProfile = await fetchAllergyProfile();
            if (allergyProfile && allergyProfile.allergens) {
                const selected = allergyProfile.allergens.map((allergen: any) => ({
                    allergenId: allergen.allergen_id || allergen.allergenId,
                    name: allergen.name,
                    intensity: allergen.intensity,
                })).filter(allergen => allergen.allergenId);

                setSelectedAllergies(selected);
                setInitialSelectedAllergies(selected);
                setHasProfile(true);  // User has a profile
                setAllergies((prevAllergies) =>
                    prevAllergies.filter(allergy =>
                        !selected.some(selectedAllergy => selectedAllergy.allergenId === allergy.allergen_id)
                    )
                );
            } else {
                setHasProfile(false);  // No profile found
            }
        } catch (error) {
            console.error('Failed to load allergy profile', error);
            setError('Failed to load allergy profile');
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const handleRefresh = async () => {
        await loadProfileData(); // Re-fetch allergies and profile data
    };

    const handleAddAllergy = (allergy: Allergy, intensity: string) => {
        if (selectedAllergies.some((a) => a.allergenId === allergy.allergen_id)) return;

        const allergenToAdd: SelectedAllergy = { allergenId: allergy.allergen_id, name: allergy.name, intensity };
        setSelectedAllergies((prev) => [...prev, allergenToAdd]);
        setAllergies((prev) => prev.filter((a) => a.allergen_id !== allergy.allergen_id));
    };

    const handleRemoveAllergy = (id: string) => {
        const removedAllergy = selectedAllergies.find((allergy) => allergy.allergenId === id);
        if (removedAllergy) {
            setSelectedAllergies((prev) => prev.filter((selected) => selected.allergenId !== id));
            setAllergies((prev) => [...prev, { allergen_id: removedAllergy.allergenId, name: removedAllergy.name }]);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }

            const requestBody: UpdateAllergyProfileDTO = {
                allergens: selectedAllergies.map(({ allergenId, intensity }) => ({
                    allergen_id: allergenId,
                    intensity,
                })),
            };

            await axiosInstance.put(`/allergy-profiles/update/${accountId}`, requestBody);
            setSuccessMessage('Allergy profile updated successfully!');
            await handleRefresh(); // Refresh to show updated profile
            setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Error saving allergy profile');
        }
    };

    const handleCancelEdit = () => {
        setSelectedAllergies(initialSelectedAllergies); // Restore to initial allergies
        handleRefresh(); // Refresh the data
        setIsEditing(false);
    };

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'low':
                return 'border-yellow-600';
            case 'medium':
                return 'border-orange-600';
            case 'high':
                return 'border-red-600';
            default:
                return '';
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Allergy Profile</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
                    {/* Available Allergens Section */}
                    <div className="md:w-1/2 w-full">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Available Allergens</h2>
                        <ul>
                            {allergies.map((allergy) => (
                                <li key={allergy.allergen_id} className="bg-white p-4 mb-4 rounded-xl shadow text-center">
                                    <span className="font-semibold text-lg">{allergy.name}</span>
                                    {isEditing && (
                                        <div className="flex justify-center space-x-3 mt-2">
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'low')}
                                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-gray-300"
                                                title="Low Intensity"
                                            ></button>
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'medium')}
                                                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 border border-gray-300"
                                                title="Medium Intensity"
                                            ></button>
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'high')}
                                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 border border-gray-300"
                                                title="High Intensity"
                                            ></button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Selected Allergens Section */}
                    <div className="md:w-1/2 w-full mt-6 md:mt-0">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Selected Allergens</h2>
                        <ul className="mb-6">
                            {selectedAllergies.map(({ allergenId, name, intensity }) => (
                                <li
                                    key={allergenId}
                                    className={`flex justify-between items-center p-4 mb-4 rounded-xl bg-white shadow-xl border ${getIntensityColor(intensity)}`}
                                >
                                    <span className="font-semibold text-lg">{name}</span>
                                    {isEditing && (
                                        <button
                                            onClick={() => handleRemoveAllergy(allergenId)}
                                            className="bg-white text-black hover:bg-gray-200 transition duration-200 rounded px-2 py-1 border border-gray-400"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Edit or Save Buttons */}
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            {isEditing ? (
                                <>
                                    <div className="flex justify-center">
                                        <button onClick={handleCancelEdit} className="bg-gray-500 text-white rounded px-4 py-2 mx-2">Cancel</button>
                                        <button onClick={handleSaveProfile} className="bg-blue-500 text-white rounded px-4 py-2 mx-2">Save</button>
                                    </div>
                                </>
                            ) : (
                                hasProfile && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-500 text-white rounded px-4 py-2"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        {saveError && <p className="text-red-500">{saveError}</p>}
                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllergyProfilePage;
