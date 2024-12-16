import React, { useEffect, useState } from "react";
import { getAllAllergyProfileSchemas, assignAllergyProfile } from "../api/api.ts";
import { components } from "../controlfood-backend-schema";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

interface UserProfileSchemasProps {
    onBack: () => void;
    onProfileAssigned: () => void;
}

const UserProfileSchemas: React.FC<UserProfileSchemasProps> = ({ onBack, onProfileAssigned }) => {
    const [schemas, setSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSchemas, setSelectedSchemas] = useState<Set<string>>(new Set());
    const [assigning, setAssigning] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false); // To control modal visibility

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

    const toggleSchemaSelection = (schemaId: string) => {
        setSelectedSchemas((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(schemaId)) {
                newSelected.delete(schemaId);
            } else {
                newSelected.add(schemaId);
            }
            return newSelected;
        });
    };

    const handleAssign = async () => {
        if (selectedSchemas.size === 0) {
            alert("Please select at least one schema.");
            return;
        }

        setModalOpen(true); // Open the modal to ask for intensity
    };

    const handleIntensitySelection = async (intensity: string) => {
        setModalOpen(false); // Close the modal once intensity is selected

        setAssigning(true);

        try {
            const data: components["schemas"]["AssignProfileDTO"] = {
                schema_ids: Array.from(selectedSchemas),
                intensity: intensity,
            };

            await assignAllergyProfile(data);
            toast.success("Stworzenie profilu powiodło się");
            setTimeout(() => onProfileAssigned(), 900);
        } catch (error) {
            console.error("Failed to assign profile:", error);
            toast.error("Stworzenie profilu nie powiodło się");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">Szablony profilów alergicznych</h1>

            <button
                onClick={onBack}
                className="bg-gray-300 text-gray-700 p-3 rounded-full hover:bg-gray-400 transform transition-transform duration-200 hover:scale-105 mb-4"
            >
                <ArrowLeftIcon className="h-6 w-6" />
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
                            className={`relative bg-white border rounded-lg p-6 shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200 ${
                                selectedSchemas.has(schema.schema_id as string) ? "border-blue-500" : "border-gray-300"
                            }`}
                            onClick={() => toggleSchemaSelection(schema.schema_id as string)}
                        >
                            <div className="absolute top-0 right-0 -mt-3 -mr-3 p-2 rounded-full">
                                {selectedSchemas.has(schema.schema_id as string) && (
                                    <div className="bg-blue-500 text-white p-2 rounded-full">
                                        <FiCheckCircle className="h-6 w-6"/>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-lg font-semibold mb-4 text-center">{schema.name || "Unnamed Schema"}</h2>
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-3">
                                    {schema.allergens && schema.allergens.length > 0 ? (
                                        schema.allergens.map((allergen, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-500 text-white text-sm py-2 px-4 rounded-full shadow-md hover:scale-105 cursor-pointer transition-transform"
                                            >
                                            {allergen.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="italic text-gray-500">No allergens listed</span>
                                    )}
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && (
                <div className="fixed bottom-4 right-4">
                    {selectedSchemas.size > 0 && (
                        <button
                            className={`bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors ${
                                assigning ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={handleAssign}
                            disabled={assigning}
                        >
                            {assigning ? (
                                <FiLoader className="animate-spin text-2xl" />
                            ) : (
                                <FiCheckCircle className="text-2xl" />
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Modal do wyboru intensywności */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <h2 className="text-xl font-semibold mb-6 text-center">Wybierz poziom intensywności alergenów</h2>

                        <div className="flex flex-col gap-4">
                            {/* High Intensity */}
                            <div
                                className="relative bg-red-500 text-white text-center rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleIntensitySelection("high")}
                            >
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-red-600 rounded-b-full"></div>
                                <div className="py-6 text-lg font-bold">Wysoka</div>
                            </div>

                            {/* Medium Intensity */}
                            <div
                                className="relative bg-orange-500 text-white text-center rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleIntensitySelection("medium")}
                            >
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-orange-600 rounded-b-full"></div>
                                <div className="py-6 text-lg font-bold">Średnia</div>
                            </div>
                            {/* Low Intensity */}
                            <div
                                className="relative bg-yellow-400 text-white text-center rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => handleIntensitySelection("low")}
                            >
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-yellow-500 rounded-b-full"></div>
                                <div className="py-6 text-lg font-bold">Niska</div>
                            </div>

                        </div>

                        {/* Cancel Button */}
                        <button
                            className="mt-6 bg-gray-300 text-gray-700 px-6 py-2 rounded-full w-full hover:bg-gray-400"
                            onClick={() => setModalOpen(false)}
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default UserProfileSchemas;
