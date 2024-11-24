import React, { useState } from "react";
import { components } from "../controlfood-backend-schema";
import { createAllergyProfileSchema } from "../api/api.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle, FiLoader } from "react-icons/fi"; // Import the FiLoader spinner icon

interface Props {
    onCreate: (newSchema: components["schemas"]["GetAllergyProfileSchemaDTO"]) => void;
    allergens: components["schemas"]["GetAllergenDTO"][];
    onClose: () => void; // Callback to close the form
}

export const CreateAllergyProfileSchemaForm: React.FC<Props> = ({ onCreate, allergens, onClose }) => {
    const [name, setName] = useState<string>("");
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!name || selectedAllergens.length === 0) {
            setError("Please provide a profile name and select at least one allergen.");
            setLoading(false);
            return;
        }

        const allergensPayload = selectedAllergens.map((allergenId) => ({
            allergen_id: allergenId,
            intensity: "", // Default to empty intensity, you can customize this later
        }));

        const requestBody = {
            name,
            allergens: allergensPayload,
        };

        try {
            await createAllergyProfileSchema(requestBody);
            toast.success("New allergy profile schema created successfully!");
            onCreate({ name, allergens: allergensPayload }); // This calls the parent function to update the list

            // Clear form state after submission
            setName("");
            setSelectedAllergens([]);

            onClose(); // Close the form after submission
        } catch (error) {
            setError("Error creating allergy profile. Please try again.");
            toast.error("Failed to create allergy profile schema.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAllergenChange = (allergenId: string) => {
        setSelectedAllergens((prev) =>
            prev.includes(allergenId)
                ? prev.filter((id) => id !== allergenId) // If it's already selected, remove it
                : [...prev, allergenId] // If it's not selected, add it
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-full sm:max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg overflow-y-auto"
        >
            {/* Profile name input */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter profile name"
                className="p-3 border rounded-full w-full shadow-md"
                required
            />

            {/* Allergens selection */}
            <div>
                <h3 className="font-semibold text-lg mb-4">Select Allergens:</h3>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    {allergens.map((allergen) => (
                        <div
                            key={allergen.allergen_id}
                            onClick={() => handleAllergenChange(allergen.allergen_id as string)}
                            className={`cursor-pointer px-4 py-2 text-sm sm:text-base rounded-full border-2 transition-all duration-200 
                            ${selectedAllergens.includes(allergen.allergen_id as string)
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-orange-100"}`}
                        >
                            {allergen.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Error message */}
            {error && <div className="text-red-600">{error}</div>}

            {/* Submit button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <FiLoader className="animate-spin text-2xl" /> // Show spinning loader when submitting
                    ) : (
                        <FiCheckCircle className="text-2xl" />
                    )}
                </button>
            </div>
        </form>
    );
};
