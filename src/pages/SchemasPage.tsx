import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import { getAllAllergyProfileSchemas, getAllAllergens } from "../api/api.ts";
import { CreateAllergyProfileSchemaForm } from "../forms/CreateAllergyProfileSchemaForm"; // Import formularza

const SchemasPage: React.FC = () => {
    const [allergyProfileSchemas, setAllergyProfileSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]); // Lista alergenów
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [selectedSchema, setSelectedSchema] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"] | null>(null); // Selected schema state
    const [isFormVisible, setFormVisible] = useState<boolean>(false); // To toggle form visibility

    // Fetch allergy profile schemas and allergens
    useEffect(() => {
        const fetchAllergyProfileSchemas = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllAllergyProfileSchemas();
                setAllergyProfileSchemas(response.data);
            } catch (error) {
                console.error('Error fetching allergy profiles:', error);
                setError('Error fetching allergy profiles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };


        const fetchAllergens = async () => {
            try {
                const response = await getAllAllergens();
                setAllergens(response); // Set allergens data
            } catch (error) {
                console.error("Error fetching allergens:", error);
                setError("Error fetching allergens.");
            }
        };

        fetchAllergyProfileSchemas(); // Fetch allergy profiles
        fetchAllergens(); // Fetch allergens
    }, []);

    // Handle schema click for details
    const handleSchemaClick = (schema: components["schemas"]["GetAllergyProfileSchemaDTO"]) => {
        setSelectedSchema(schema);
    };

    // Handle schema creation after form submission
    const handleSchemaCreate = (newSchema: components["schemas"]["GetAllergyProfileSchemaDTO"]) => {
        setAllergyProfileSchemas((prevSchemas) => [...prevSchemas, newSchema]);
        setFormVisible(false); // Hide the form after submission
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">Allergy Profile Schemas</h1>

            {/* Show Loading or Error Messages */}
            {loading && <div className="text-center text-xl text-blue-600">Loading...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            {/* Toggle Form Button */}
            <div className="text-center mb-6">
                <button
                    onClick={() => setFormVisible(true)}
                    className="bg-green-500 text-white px-6 py-2 rounded"
                >
                    Create New Allergy Profile
                </button>
            </div>

            {/* Show the form if it's visible */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setFormVisible(false)}
                        >
                            &times;
                        </button>
                        <CreateAllergyProfileSchemaForm
                            onCreate={handleSchemaCreate}
                            allergens={allergens} // Pass allergens to the form
                        />
                    </div>
                </div>
            )}

            {/* Show the list of allergy profile schemas */}
            {!isFormVisible && !loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allergyProfileSchemas.map((allergyProfileSchema) => (
                        <div
                            key={allergyProfileSchema.schema_id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col cursor-pointer"
                            onClick={() => handleSchemaClick(allergyProfileSchema)}
                        >
                            <h2 className="font-semibold text-lg text-center">
                                {allergyProfileSchema.name || "Unnamed Product"}
                            </h2>
                        </div>
                    ))}
                </div>
            )}

            {/* Show selected schema details */}
            {selectedSchema && (
                <div className="mt-8 border border-gray-300 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-center mb-4">{selectedSchema.name}</h2>
                    <p className="text-lg">Schema ID: {selectedSchema.schema_id}</p>

                    <h3 className="font-semibold text-lg mt-4">Allergens:</h3>
                    <ul className="list-disc pl-5">
                        {selectedSchema.allergens?.map((allergen, index) => (
                            <li key={index}>{allergen.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SchemasPage;
