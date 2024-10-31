import React, { useState, useEffect } from 'react';
import AllergySelector from './AllergySelector';
import { components } from "../controlfood-backend-schema";
import axiosInstance from "../api/axiosConfig.ts";
import { authService } from '../utils/authService';

type CreateAllergyProfileDTO = components["schemas"]["CreateAllergyProfileDTO"];

interface Allergy {
    allergen_id: string;
    name: string;
}

interface SelectedAllergy {
    allergenId: string;
    name: string;
    intensity: string;
}

const AllergyProfilePage: React.FC<{ }> = () => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);


    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Allergy[]>('/allergens');
            setAllergies(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching allergens');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllergies();
    }, []);

    const handleAddAllergy = (allergy: Allergy, intensity: string) => {
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
            console.log("ID ACCOUNT:" , accountId)
            // Check if accountId is null
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }

            const requestBody: CreateAllergyProfileDTO = {
                accountId: accountId, // Now guaranteed to be a string
                allergens: selectedAllergies.map(({ allergenId, intensity }) => ({ allergenId, intensity })),
            };

            await axiosInstance.post('/allergy-profiles/create', requestBody);
            alert('Allergy profile saved successfully!');
            setSelectedAllergies([]);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Error saving allergy profile');
        }
    };

    const availableAllergies = allergies.filter(
        (allergy) => !selectedAllergies.some((selected) => selected.allergenId === allergy.allergen_id)
    );

    return (
        <div className="p-6 md:p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Allergy Profile</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col md:flex-row md:space-x-6">
                    <AllergySelector
                        allergies={availableAllergies}
                        onAddAllergy={handleAddAllergy}
                        selectedAllergies={selectedAllergies}
                    />
                    <div className="md:w-1/2 w-full mt-6 md:mt-0">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Selected Allergens</h2>
                        <ul>
                            {selectedAllergies.map(({ allergenId, name, intensity }) => (
                                <li key={allergenId} className="flex justify-between items-center bg-white p-4 mb-4 rounded-lg shadow">
                                    <span className="font-semibold text-lg">{name}</span> - Intensity: {intensity}
                                    <button
                                        onClick={() => handleRemoveAllergy(allergenId)}
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <button
                onClick={handleSaveProfile}
                className="mt-6 bg-red-500 text-white py-3 px-8 rounded text-xl hover:bg-red-600 transition w-full md:w-80 mx-auto block"
            >
                Save Profile
            </button>
            {saveError && <p className="text-red-500 mt-4 text-center">{saveError}</p>}
        </div>
    );
};

export default AllergyProfilePage;
