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
        console.log(error)
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
            toast.success("Nowy szablon został pomyślnie dodany");
            onCreate({ name, allergens: allergensPayload }); // This calls the parent function to update the list

            // Clear form state after submission
            setName("");
            setSelectedAllergens([]);

            onClose(); // Close the form after submission
        } catch (error: any) {
            if (error?.response?.status === 400) {
                // Check for a 400 status error, likely due to a conflict (e.g., profile name already exists)
                setError("Szablon o takiej nazwie już istnieje.");
                toast.error("Szablon o takiej nazwie już istnieje.");
            } else {
                setError("Error creating allergy profile. Please try again.");
                toast.error("Stworzenie szablonu nie powiodło się");
            }
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

    // Split allergens into categories
    const allergensList = allergens.reduce(
        (acc, allergen) => {
            if (allergen.allergenType === "ALLERGEN") {
                acc.allergens.push(allergen);
            } else if (allergen.allergenType === "INTOLERANT_INGREDIENT") {
                acc.intolerants.push(allergen);
            }
            return acc;
        },
        { allergens: [] as components["schemas"]["GetAllergenDTO"][], intolerants: [] as components["schemas"]["GetAllergenDTO"][] }
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-center mb-6">Tworzenie nowego szablonu profilu alergicznego</h2>

                <div className="relative space-y-6">
                    {/* Profile name input */}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mb-6"
                        placeholder="Nazwa szablonu"
                    />

                    {/* Allergens and Intolerants selection */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Column: Allergens */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-lg text-orange-500 mb-4 text-center">Alergeny</h3>
                            <div
                                className="flex flex-wrap gap-2 p-4 border rounded-md overflow-y-auto max-h-96 bg-gray-50"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#d1d5db #f9fafb",
                                }}
                            >
                                {allergensList.allergens.map((allergen) => (
                                    <button
                                        key={allergen.allergen_id}
                                        onClick={() => handleAllergenChange(allergen.allergen_id as string)}
                                        className={`px-4 py-2 rounded-full text-sm border 
                                        ${selectedAllergens.includes(allergen.allergen_id as string)
                                            ? "bg-orange-500 text-white border-orange-500"
                                            : "bg-gray-200 border-gray-300"}`}
                                    >
                                        {allergen.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Column: Intolerant Ingredients */}
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-lg text-blue-500 mb-4 text-center">Składniki
                                nietolerowane</h3>
                            <div
                                className="flex flex-wrap gap-2 p-4 border rounded-md overflow-y-auto max-h-96 bg-gray-50"
                                style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#d1d5db #f9fafb",
                                }}
                            >
                                {allergensList.intolerants.map((allergen) => (
                                    <button
                                        key={allergen.allergen_id}
                                        onClick={() => handleAllergenChange(allergen.allergen_id as string)}
                                        className={`px-4 py-2 rounded-full text-sm border 
                                        ${selectedAllergens.includes(allergen.allergen_id as string)
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-200 border-gray-300"}`}
                                    >
                                        {allergen.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSubmit}
                            className={`bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-600 transform transition-all duration-300 hover:scale-110`}
                            disabled={loading}
                        >
                            {loading ? (
                                <FiLoader className="animate-spin text-xl"/>
                            ) : (
                                <FiCheckCircle className="text-2xl"/>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
