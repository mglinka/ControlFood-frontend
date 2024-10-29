import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AllergySelector from './AllergySelector';
import { components } from "../controlfood-backend-schema";


type CreateAllergyProfileDTO = components["schemas"]["CreateAllergyProfileDTO"];

interface Allergy {
    allergen_id: string;
    name: string;
}

interface SelectedAllergy {
    allergenId: string;
    name: string; // Ensure we have name here
    intensity: string;
}

const AllergyProfilePage: React.FC<{ accountId: string }> = () => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);



    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Allergy[]>('http://localhost:8080/api/v1/allergens');
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
        console.log("Selected Allergies after addition:", [...selectedAllergies, allergenToAdd]);
    };

    const handleRemoveAllergy = (id: string) => {
        const removedAllergy = selectedAllergies.find((allergy) => allergy.allergenId === id);
        if (removedAllergy) {
            setSelectedAllergies((prev) => prev.filter((selected) => selected.allergenId !== id));
            setAllergies((prev) => [...prev, { allergen_id: removedAllergy.allergenId, name: removedAllergy.name }]);
        }
        console.log("Selected Allergies after removal:", selectedAllergies);
    };

    const handleSaveProfile = async () => {
        try {
            const requestBody: CreateAllergyProfileDTO = {
                accountId: "1111",
                allergens: selectedAllergies.map(({ allergenId, intensity }) => ({ allergenId, intensity })),
            };

            await axios.post('http://localhost:8080/api/v1/allergy-profiles/create', requestBody);
            alert('Allergy profile saved successfully!');
            setSelectedAllergies([]);
        } catch (err) {
            console.error("Error saving profile:", err);
            setSaveError('Error saving allergy profile');
        }
    };

    const availableAllergies = allergies.filter(
        (allergy) => !selectedAllergies.some((selected) => selected.allergenId === allergy.allergen_id)
    );

    return (
        <div className="p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Allergy Profile</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex justify-between">
                    <AllergySelector
                        allergies={availableAllergies}
                        onAddAllergy={handleAddAllergy}
                        selectedAllergies={selectedAllergies}
                    />
                    <div className="w-1/2 ml-6">
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
                className="mt-6 bg-red-500 text-white py-3 px-8 rounded text-xl hover:bg-red-600 transition w-80 mx-auto block"
            >
                Save Profile
            </button>
            {saveError && <p className="text-red-500 mt-4 text-center">{saveError}</p>}
        </div>
    );
};

export default AllergyProfilePage;
