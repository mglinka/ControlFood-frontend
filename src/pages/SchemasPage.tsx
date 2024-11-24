import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import { getAllAllergyProfileSchemas, getAllAllergens, createAllergyProfileSchema, deleteAllergyProfileSchema } from "../api/api.ts";
import { CreateAllergyProfileSchemaForm } from "../forms/CreateAllergyProfileSchemaForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen, FaTrash } from 'react-icons/fa'; // Import icons from FontAwesome
import { FaPlus } from 'react-icons/fa'; // Import the FaPlus icon


const SchemasPage: React.FC = () => {
    const [allergyProfileSchemas, setAllergyProfileSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSchema, setSelectedSchema] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"] | null>(null);
    const [isFormVisible, setFormVisible] = useState<boolean>(false);

    useEffect(() => {
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

        fetchAllergyProfileSchemas();
        fetchAllergens();
    }, []);

    const handleSchemaCreate = async (newSchema: { name?: string; allergens?: components["schemas"]["GetAllergenDTO"][] }) => {
        try {
            if (!newSchema.name || !newSchema.allergens) {
                throw new Error("Name and allergens are required.");
            }

            const transformedSchema = {
                name: newSchema.name,
                allergens: newSchema.allergens.map((allergen) => ({
                    allergen_id: allergen.allergen_id,
                })),
            };

            // Call API to create a new schema
            await createAllergyProfileSchema(transformedSchema);

            // Directly update the state with the new schema without fetching again
            setAllergyProfileSchemas((prevSchemas) => [
                ...prevSchemas,
                {
                    ...transformedSchema,
                    allergens: newSchema.allergens, // add full allergen details
                },
            ]);

            // Close the form modal
            setFormVisible(false);

        } catch (error) {
            console.error("Error creating allergy profile schema:", error);
            toast.error("Failed to create allergy profile schema. Please try again.");
        }
    };

    const handleDeleteSchema = async (schemaId: string) => {
        try {
            console.log("Delete", schemaId)
            await deleteAllergyProfileSchema(schemaId);
            setAllergyProfileSchemas((prevSchemas) => prevSchemas.filter((schema) => schema.schema_id !== schemaId));
            setSelectedSchema(null); // Close the modal after deletion
            toast.success("Allergy profile schema deleted successfully!");
        } catch (error) {
            console.error("Error deleting allergy profile schema:", error);
            toast.error("Failed to delete allergy profile schema. Please try again.");
        }
    };

    const handleEditSchema = (schemaId: string) => {
        // Logic to handle the schema editing (you can either pre-fill the form or open a different form)
        toast.info(`Editing schema ${schemaId} is not implemented yet.`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">Allergy Profile Schemas</h1>

            {loading && <div className="text-center text-xl text-blue-600">Loading...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {/* Show the "Create New Allergy Profile" button */}
            <div className="text-left mb-6">
                <button
                    onClick={() => setFormVisible(true)}
                    className="bg-orange-500 text-white p-4 rounded-full flex items-center"
                >
                    <FaPlus className="text-white text-2xl"/>
                </button>
            </div>

            {/* Show the form if it's visible */}
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
                            onClose={() => setFormVisible(false)} // Close the form when done
                        />
                    </div>
                </div>
            )}

            {/* Display the list of allergy profile schemas */}
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

            {/* Modal for selected schema */}
            {selectedSchema && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-3xl"
                            onClick={() => setSelectedSchema(null)} // Close the details modal
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold text-center mb-4">{selectedSchema.name}</h2>
                        <h3 className="font-semibold text-lg mt-4">Allergens:</h3>
                        <ul className="list-disc pl-5">
                            {selectedSchema.allergens?.map((allergen, index) => {
                                // Match the allergen_id with the full allergen data to get the name
                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                return allergenDetails ? (
                                    <li key={index}>{allergenDetails.name}</li> // Render the allergen name
                                ) : (
                                    <li key={index}>Unknown Allergen</li> // In case the allergen data is missing
                                );
                            })}
                        </ul>

                        <div className="absolute bottom-6 right-6 flex gap-4">
                            <button
                                onClick={() => handleEditSchema(selectedSchema?.schema_id as string)}
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

            <ToastContainer/>
        </div>

    );
};

export default SchemasPage;
