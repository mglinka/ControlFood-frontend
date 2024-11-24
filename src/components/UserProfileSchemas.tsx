import React, { useEffect, useState } from "react";
import { getAllAllergyProfileSchemas, assignAllergyProfile } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfileSchemasProps {
    onBack: () => void; // Function to go back
    onProfileAssigned: () => void; // Callback when profile is assigned
}

const UserProfileSchemas: React.FC<UserProfileSchemasProps> = ({ onBack, onProfileAssigned }) => {
    const [schemas, setSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSchema, setSelectedSchema] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"] | null>(null);
    const [intensity, setIntensity] = useState<string>(""); // For storing user input for intensity
    const [assigning, setAssigning] = useState<boolean>(false);

    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const response = await getAllAllergyProfileSchemas();
                setSchemas(response.data);
            } catch (error) {
                setError("Failed to load schemas. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchemas();
    }, []);

    const openModal = (schema: components["schemas"]["GetAllergyProfileSchemaDTO"]) => {
        setSelectedSchema(schema);
        setIntensity(""); // Reset intensity when opening modal
    };

    const closeModal = () => {
        setSelectedSchema(null);
        setIntensity("");
    };

    const handleChoose = async () => {
        if (selectedSchema) {
            if (!selectedSchema.schema_id) {
                console.error("Schema ID is undefined.");
                alert("Invalid schema selected. Please try again.");
                return;
            }

            if (!intensity) {
                alert("Please select an intensity level.");
                return;
            }

            // Validate that all allergens have IDs
            const allergens = selectedSchema.allergens?.map((allergen) => {
                if (!allergen.allergen_id) {
                    console.error("Allergen ID is undefined for an allergen.");
                    throw new Error("Invalid allergen data.");
                }
                return { allergen_id: allergen.allergen_id };
            });

            setAssigning(true);

            try {
                // Construct the AssignProfileDTO object
                const data: components["schemas"]["AssignProfileDTO"] = {
                    schema_id: selectedSchema.schema_id,
                    allergens: allergens?.map((allergen) => ({ allergen_id: allergen.allergen_id })) || [],
                    intensity, // Use user-selected intensity
                };

                // Call the assignAllergyProfile API
                await assignAllergyProfile(data);
                toast.success("Profile assigned successfully!");

                // Trigger the callback to update the parent component
                setTimeout(()=> onProfileAssigned(), 900);

                closeModal();
            } catch (error) {
                console.error("Failed to assign profile:", error);
                toast.error("Failed to assign profile. Please try again.");
            } finally {
                setAssigning(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">User Profile Schemas</h1>

            <button
                onClick={onBack} // Funkcja powrotu
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors mb-4"
            >
                Back to Profile Creation
            </button>

            {loading && <p className="text-center text-blue-600">Loading schemas...</p>}

            {error && <p className="text-center text-red-600">{error}</p>}

            {!loading && !error && schemas.length === 0 && (
                <p className="text-center text-gray-500 italic">No schemas available.</p>
            )}

            {!loading && !error && schemas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {schemas.map((schema) => (
                        <div
                            key={schema.schema_id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col cursor-pointer"
                            onClick={() => openModal(schema)}
                        >
                            <h2 className="text-lg font-semibold mb-2 text-center">
                                {schema.name || "Unnamed Schema"}
                            </h2>

                            <div className="mt-4">
                                <h3 className="font-semibold text-sm mb-1">Allergens:</h3>
                                <ul className="list-disc pl-5 text-sm">
                                    {schema.allergens && schema.allergens.length > 0 ? (
                                        schema.allergens.map((allergen, index) => (
                                            <li key={index}>{allergen.name}</li>
                                        ))
                                    ) : (
                                        <li className="italic text-gray-500">No allergens listed</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedSchema && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold text-center mb-4">
                            {selectedSchema.name || "Unnamed Schema"}
                        </h2>

                        <div className="mb-4">
                            <h3 className="font-semibold text-sm mb-1">Allergens:</h3>
                            <ul className="list-disc pl-5 text-sm">
                                {selectedSchema.allergens && selectedSchema.allergens.length > 0 ? (
                                    selectedSchema.allergens.map((allergen, index) => (
                                        <li key={index}>{allergen.name}</li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-500">No allergens listed</li>
                                )}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="intensity" className="block font-semibold text-sm mb-2">
                                Intensity Level
                            </label>
                            <select
                                id="intensity"
                                value={intensity}
                                onChange={(e) => setIntensity(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="" disabled>
                                    Select intensity
                                </option>
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                onClick={handleChoose}
                                disabled={assigning}
                            >
                                {assigning ? "Assigning..." : "Choose"}
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                onClick={closeModal}
                                disabled={assigning}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default UserProfileSchemas;
