import React, { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosConfig";
import { authService } from '../utils/authService';
import { components } from "../controlfood-backend-schema";

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

const AllergyProfilePage: React.FC = () => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<Allergy[]>('/allergens');
            const uniqueAllergies = response.data.filter(
                (allergy, index, self) =>
                    index === self.findIndex((a) => a.allergen_id === allergy.allergen_id)
            );
            setAllergies(uniqueAllergies);
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

            const requestBody: CreateAllergyProfileDTO = {
                accountId: accountId,
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
                <div className="flex flex-col md:flex-row md:space-x-6 justify-between">
                    {/* Available Allergens Section */}
                    <div className="md:w-1/2 w-full">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Available Allergens</h2>
                        <ul>
                            {availableAllergies.map((allergy) => (
                                <li key={allergy.allergen_id} className="bg-white p-4 mb-4 rounded-xl shadow text-center">
                                    <span className="font-semibold text-lg">{allergy.name}</span>
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
                                    className="flex justify-between items-center bg-white p-4 mb-4 rounded-xl shadow"
                                    style={{
                                        borderLeft: `6px solid ${
                                            intensity === 'high' ? '#e3342f' :
                                                intensity === 'medium' ? '#f6993f' :
                                                    '#ffed4a'
                                        }`,
                                    }}
                                >
                                    <span className="font-semibold text-lg">{name}</span>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{
                                            backgroundColor: intensity === 'high' ? '#e3342f' :
                                                intensity === 'medium' ? '#f6993f' :
                                                    '#ffed4a',
                                        }}
                                    ></div>
                                    <button
                                        onClick={() => handleRemoveAllergy(allergenId)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {/* Legend Section */}
            <div className="mt-6">
                <h3 className="font-semibold text-center">Legend:</h3>
                <div className="flex justify-center space-x-4 mt-2">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="ml-2">High</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span className="ml-2">Medium</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="ml-2">Low</span>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSaveProfile}
                className="mt-6 bg-red-500 text-white py-3 px-8 rounded-lg text-xl hover:bg-red-600 transition w-full md:w-80 mx-auto block"
            >
                Save Profile
            </button>
            {saveError && <p className="text-red-500 mt-4 text-center">{saveError}</p>}
        </div>
    );
};

export default AllergyProfilePage;
