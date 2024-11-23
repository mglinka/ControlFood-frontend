import React, { useEffect, useState } from "react";
import { getAllAllergyProfileSchemas } from "../api/api.ts"; // Adjust the path if needed
import { components } from "../controlfood-backend-schema";

const UserProfileSchemas: React.FC = () => {
    const [schemas, setSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch schemas on component mount
    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const response = await getAllAllergyProfileSchemas();
                setSchemas(response.data);
            } catch (error) {
                console.error("Error fetching schemas:", error);
                setError("Failed to load schemas. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchemas();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">User Profile Schemas</h1>

            {/* Display loading message */}
            {loading && <p className="text-center text-blue-600">Loading schemas...</p>}

            {/* Display error message */}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Display schemas */}
            {!loading && !error && schemas.length === 0 && (
                <p className="text-center text-gray-500 italic">No schemas available.</p>
            )}

            {!loading && !error && schemas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {schemas.map((schema) => (
                        <div
                            key={schema.schema_id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
                        >
                            <h2 className="text-lg font-semibold mb-2 text-center">
                                {schema.name || "Unnamed Schema"}
                            </h2>
                            <p className="text-sm text-gray-600 text-center">
                                Schema ID: {schema.schema_id}
                            </p>
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
        </div>
    );
};

export default UserProfileSchemas;
