import React, { useState } from 'react';

interface Allergy {
    allergen_id: string;
    name: string;
}

interface SelectedAllergy {
    allergenId: string;
    intensity?: string;
}

interface AllergySelectorProps {
    allergies: Allergy[];
    onAddAllergy: (allergy: Allergy, intensity: string) => void;
    selectedAllergies: SelectedAllergy[];
}

const AllergySelector: React.FC<AllergySelectorProps> = ({ allergies, onAddAllergy, selectedAllergies }) => {
    const [intensities, setIntensities] = useState<Record<string, string>>({});

    const handleIntensityChange = (id: string, value: string) => {
        setIntensities((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    return (
        <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Allergens</h2>
            <ul>
                {allergies.map((allergy) => (
                    <li key={allergy.allergen_id} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 mb-4 rounded-lg shadow">
                        <span>{allergy.name}</span>
                        <select
                            value={intensities[allergy.allergen_id] || 'Low'}
                            onChange={(e) => handleIntensityChange(allergy.allergen_id, e.target.value)}
                            className="mt-2 md:mt-0 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-gray-700"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <button
                            onClick={() => onAddAllergy(allergy, intensities[allergy.allergen_id] || 'Low')}
                            className="mt-2 md:mt-0 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                            disabled={selectedAllergies.some(selected => selected.allergenId === allergy.allergen_id)}
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllergySelector;
