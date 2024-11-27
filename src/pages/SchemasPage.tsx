import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import {
    getAllAllergyProfileSchemas,
    getAllAllergens,
    deleteAllergyProfileSchema,
    editAllergyProfileSchema
} from "../api/api.ts";
import { CreateAllergyProfileSchemaForm } from "../forms/CreateAllergyProfileSchemaForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa'; // Added FaTimes for chip close icon

const SchemasPage: React.FC = () => {
    const [allergyProfileSchemas, setAllergyProfileSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSchema, setSelectedSchema] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"] | null>(null);
    const [isFormVisible, setFormVisible] = useState<boolean>(false);

    // For editing schema
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSchemaId, setEditSchemaId] = useState("");
    const [editSchemaName, setEditSchemaName] = useState("");
    const [editAllergens, setEditAllergens] = useState<Set<string>>(new Set()); // Using a Set to track selected allergens

    const fetchAllergyProfileSchemas = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllAllergyProfileSchemas();
            setAllergyProfileSchemas(response.data);
        } catch (error) {
            console.error("Error fetching allergy profiles:", error);
            setError("Error fetching allergy profiles. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllergens = async () => {
        try {
            const response = await getAllAllergens();
            setAllergens(response);
        } catch (error) {
            console.error("Error fetching allergens:", error);
            setError("Error fetching allergens.");
        }
    };

    useEffect(() => {
        fetchAllergyProfileSchemas();
        fetchAllergens();
    }, []);

    const handleSchemaCreate = async (newSchema: { name?: string; allergens?: components["schemas"]["GetAllergenDTO"][] }) => {
        if (!newSchema.name || !newSchema.allergens) {
            toast.error("Name and allergens are required.");
            return;
        }

        setAllergyProfileSchemas((prevSchemas) => [
            ...prevSchemas,
            {
                ...newSchema,
                allergens: newSchema.allergens, // add full allergen details
            },
        ]);

        setFormVisible(false);
        await fetchAllergyProfileSchemas();
    };

    const handleDeleteSchema = async (schemaId: string) => {
        if (!schemaId) {
            toast.error("Invalid schema ID.");
            return;
        }

        try {
            await deleteAllergyProfileSchema(schemaId);
            fetchAllergyProfileSchemas(); // Re-fetch the schemas to get the updated list
            setSelectedSchema(null); // Close the modal after deletion
            toast.success("Allergy profile schema deleted successfully!");
        } catch (error) {
            console.error("Error deleting allergy profile schema:", error);
            toast.error("Failed to delete allergy profile schema. Please try again.");
        }
    };

    const handleEditSchema = (schemaId: string, name: string, allergens: components["schemas"]["GetAllergenDTO"][]) => {
        setEditSchemaId(schemaId);
        setEditSchemaName(name);

        // Set the selected allergens as a Set for easier management
        const selectedAllergens = new Set(allergens
            .map((allergen) => allergen.allergen_id)
            .filter((id): id is string => id !== undefined) // Ensure id is a string, not undefined
        );

        setEditAllergens(selectedAllergens);
        setIsEditModalOpen(true);  // Open the modal
    };

    const handleEditSubmit = async () => {
        const payload = {
            schema_id: editSchemaId,
            name: editSchemaName,
            allergens: Array.from(editAllergens).map((allergen_id) => ({ allergen_id })), // Convert Set to array of objects
        };

        try {
            await editAllergyProfileSchema(payload); // Make the API request to update the schema
            toast.success("Schema updated successfully!");

            // Re-fetch the allergy profile schemas to get the updated information
            await fetchAllergyProfileSchemas(); // Refresh the list of schemas

            // Update selected schema to reflect the changes immediately in the modal
            setSelectedSchema((prev) => {
                if (prev && prev.schema_id === editSchemaId) {
                    return { ...prev, name: editSchemaName, allergens: Array.from(editAllergens).map((id) => ({ allergen_id: id })) };
                }
                return prev;
            });

            setIsEditModalOpen(false); // Close the edit modal
        } catch (error) {
            toast.error("Failed to update schema.");
        }
    };

    const toggleAllergenSelection = (allergen_id: string) => {
        const newSelectedAllergens = new Set(editAllergens);
        if (newSelectedAllergens.has(allergen_id)) {
            newSelectedAllergens.delete(allergen_id);
        } else {
            newSelectedAllergens.add(allergen_id);
        }
        setEditAllergens(newSelectedAllergens);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">Allergy Profile Schemas</h1>

            {loading && <div className="text-center text-xl text-blue-600">Loading...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            <div className="text-left mb-6">
                <button
                    onClick={() => setFormVisible(true)}
                    className="bg-orange-500 text-white p-4 rounded-full flex items-center"
                >
                    <FaPlus className="text-white text-2xl"/>
                </button>
            </div>

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setFormVisible(false)}
                        >
                            &times;
                        </button>
                        <CreateAllergyProfileSchemaForm
                            onCreate={handleSchemaCreate}
                            allergens={allergens}
                            onClose={() => setFormVisible(false)}
                        />
                    </div>
                </div>
            )}

            {!isFormVisible && !loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allergyProfileSchemas.map((allergyProfileSchema) => (
                        <div
                            key={allergyProfileSchema.schema_id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col cursor-pointer"
                            onClick={() => setSelectedSchema(allergyProfileSchema)}
                        >
                            <h2 className="font-semibold text-lg text-center">
                                {allergyProfileSchema.name || "Unnamed Product"}
                            </h2>
                        </div>
                    ))}
                </div>
            )}

            {selectedSchema && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-3xl"
                            onClick={() => setSelectedSchema(null)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold text-center mb-4">{selectedSchema.name}</h2>
                        <h3 className="font-semibold text-lg mt-4">Allergens:</h3>
                        <ul className="list-disc pl-5">
                            {selectedSchema.allergens?.map((allergen, index) => {
                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                return allergenDetails ? (
                                    <li key={index}>{allergenDetails.name}</li>
                                ) : (
                                    <li key={index}>Unknown Allergen</li>
                                );
                            })}
                        </ul>

                        <div className="absolute bottom-6 right-6 flex gap-4">
                            <button
                                onClick={() => handleEditSchema(selectedSchema?.schema_id as string, selectedSchema?.name as string, selectedSchema?.allergens || [])}
                                className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600"
                            >
                                <FaPen className="w-5 h-5 text-white"/>
                            </button>
                            <button
                                onClick={() => handleDeleteSchema(selectedSchema?.schema_id as string)}
                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                            >
                                <FaTrash className="w-5 h-5 text-white"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold text-center mb-4">Edit Allergy Profile Schema</h2>

                        <div>
                            <input
                                type="text"
                                value={editSchemaName}
                                onChange={(e) => setEditSchemaName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                placeholder="Schema Name"
                            />
                            <div>
                                <h3 className="font-semibold mb-2">Select Allergens</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {allergens.map((allergen) => (
                                        <button
                                            key={allergen.allergen_id}
                                            onClick={() => toggleAllergenSelection(allergen.allergen_id as string)}
                                            className={`px-4 py-2 rounded-full text-sm border ${editAllergens.has(allergen.allergen_id as string) ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {allergen.name}

                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleEditSubmit}
                                className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 w-full"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default SchemasPage;
