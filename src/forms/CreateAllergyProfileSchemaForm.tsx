import React, { useState } from "react";
import { components } from "../controlfood-backend-schema";
import { createAllergyProfileSchema } from "../api/api.ts";

interface Props {
    onCreate: (newSchema: components["schemas"]["GetAllergyProfileSchemaDTO"]) => void;
    allergens: components["schemas"]["GetAllergenDTO"][];
}

export const CreateAllergyProfileSchemaForm: React.FC<Props> = ({  allergens }) => {
    const [name, setName] = useState<string>("");
    const [selectedAllergens, setSelectedAllergens] = useState<{ allergenId: string; intensity: string }[]>([]); // List of selected allergens with intensity
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const allergensPayload = selectedAllergens.map(({ allergenId, intensity }) => ({
            allergen_id: allergenId,
            intensity,
        }));

        const requestBody = {
            name,
            allergens: allergensPayload,
        };

        try {
            await createAllergyProfileSchema(requestBody);

        } catch (error) {
            setError("Error creating allergy profile. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAllergenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const allergenId = event.target.value;
        const isChecked = event.target.checked;

        setSelectedAllergens((prev) =>
            isChecked
                ? [...prev, { allergenId, intensity: "" }]
                : prev.filter((item) => item.allergenId !== allergenId)  // Remove allergenId if unchecked
        );
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter profile name"
                className="p-2 border rounded w-full"
                required
            />

            <div>
                <h3 className="font-semibold mb-2">Select Allergens:</h3>
                <div className="space-y-2">
                    {allergens.map((allergen) => (
                        <div key={allergen.allergen_id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={allergen.allergen_id}
                                value={allergen.allergen_id}
                                onChange={handleAllergenChange}
                                className="mr-2"
                            />
                            <label htmlFor={allergen.allergen_id}>{allergen.name}</label>

                        </div>
                    ))}
                </div>
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Allergy Profile"}
                </button>
            </div>
        </form>
    );
};
