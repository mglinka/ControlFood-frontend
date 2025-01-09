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
import {FaPen, FaTrash, FaPlus, FaSpinner} from 'react-icons/fa';
import {FiCheckCircle} from "react-icons/fi"; // Added FaTimes for chip close icon

const SchemasPage: React.FC = () => {
    const [allergyProfileSchemas, setAllergyProfileSchemas] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"][]>([]);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSchema, setSelectedSchema] = useState<components["schemas"]["GetAllergyProfileSchemaDTO"] | null>(null);
    const [isFormVisible, setFormVisible] = useState<boolean>(false);

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
            toast.error("Nazwa szablonu i alergeny są wymagane");
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
            toast.error("nieodpowiedni format");
            return;
        }

        try {
            await deleteAllergyProfileSchema(schemaId);
            fetchAllergyProfileSchemas(); // Re-fetch the schemas to get the updated list
            setSelectedSchema(null); // Close the modal after deletion
            toast.success("Szablon został pomyślnie usunięty");
        } catch (error) {
            console.error("Error deleting allergy profile schema:", error);
            toast.error("Nie udało się usunąć szablonu");
        }
    };

    const handleEditSchema = (schemaId: string, name: string, allergens: components["schemas"]["GetAllergenDTO"][]) => {
        setSelectedSchema(null);

        setEditSchemaId(schemaId);
        setEditSchemaName(name);

        const selectedAllergens = new Set(allergens
            .map((allergen) => allergen.allergen_id)
            .filter((id): id is string => id !== undefined) // Ensure id is a string, not undefined
        );

        setEditAllergens(selectedAllergens);
        setIsEditModalOpen(true);  // Open the edit modal
    };

    const handleEditSubmit = async () => {
        const payload = {
            schema_id: editSchemaId,
            name: editSchemaName,
            allergens: Array.from(editAllergens).map((allergen_id) => ({ allergen_id })), // Convert Set to array of objects
        };

        try {
            await editAllergyProfileSchema(payload); // Make the API request to update the schema
            toast.success("Edycja szablonu powiodła się");

            await fetchAllergyProfileSchemas(); // Refresh the list of schemas

            setSelectedSchema((prev) => {
                if (prev && prev.schema_id === editSchemaId) {
                    return { ...prev, name: editSchemaName, allergens: Array.from(editAllergens).map((id) => ({ allergen_id: id })) };
                }
                return prev;
            });

            setIsEditModalOpen(false); // Close the edit modal
        } catch (error: any) {
            if (error?.response?.status === 400) {
                toast.error("Szablon o tej nazwie już istnieje.");
            } else {
                toast.error("Edycja szablonu nie powiodła się");
            }
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
            <h1 className="text-2xl font-semibold mb-6 text-center">Szablony profili alergicznych</h1>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <FaSpinner className="text-orange-600 text-3xl animate-spin" />
                </div>
            )}

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
                            className="border border-gray-300 p-4 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col cursor-pointer"
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

                        {/* Sekcja z nazwą */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-center">{selectedSchema.name}</h2>
                        </div>

                        <div className="mb-6">

                            {/* Sekcja: Alergeny */}
                            <div className="mb-4">
                                <h4 className="font-semibold text-md text-orange-500 mb-2">Alergeny:</h4>
                                <div className="flex flex-wrap gap-4">
                                    {selectedSchema.allergens &&
                                        selectedSchema.allergens
                                            .filter((allergen) => {
                                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                                return allergenDetails?.allergenType === "ALLERGEN";
                                            })
                                            .map((allergen) => {
                                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                                return allergenDetails ? (
                                                    <span
                                                        key={allergenDetails.allergen_id!}
                                                        className="inline-block px-6 py-3 rounded-full bg-white border-2 border-orange-500 text-black text-lg font-semibold"
                                                    >
                                {allergenDetails.name}
                            </span>
                                                ) : (
                                                    <span
                                                        key={allergen?.allergen_id || Math.random()} // Obsłuż brak klucza
                                                        className="inline-block px-6 py-3 rounded-full bg-gray-200 border-2 text-black text-lg font-semibold"
                                                    >
                                Nieznany alergen
                            </span>
                                                );
                                            })}
                                </div>
                            </div>

                            {/* Sekcja: Składniki nietolerowane */}
                            <div>
                                <h4 className="font-semibold text-md text-blue-500 mb-2">Składniki nietolerowane:</h4>
                                <div className="flex flex-wrap gap-4">
                                    {selectedSchema.allergens &&
                                        selectedSchema.allergens
                                            .filter((allergen) => {
                                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                                return allergenDetails?.allergenType === "INTOLERANT_INGREDIENT";
                                            })
                                            .map((allergen) => {
                                                const allergenDetails = allergens.find((a) => a.allergen_id === allergen.allergen_id);
                                                return allergenDetails ? (
                                                    <span
                                                        key={allergenDetails.allergen_id!}
                                                        className="inline-block px-6 py-3 rounded-full bg-white border-2 border-blue-500 text-black text-lg font-semibold"
                                                    >
                                {allergenDetails.name}
                            </span>
                                                ) : (
                                                    <span
                                                        key={allergen?.allergen_id || Math.random()} // Obsłuż brak klucza
                                                        className="inline-block px-6 py-3 rounded-full bg-gray-200 border-2 text-black text-lg font-semibold"
                                                    >
                                Nieznany składnik
                            </span>
                                                );
                                            })}
                                </div>
                            </div>
                        </div>


                        {/* Sekcja z przyciskami */}
                        <div className="flex justify-end gap-4 mt-6">
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
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-semibold text-center mb-6 rounded-full">Edytuj szablon profilu
                            alergicznego</h2>

                        <div className="relative space-y-6">
                            {/* Pole nazwy */}
                            <input
                                type="text"
                                value={editSchemaName}
                                onChange={(e) => setEditSchemaName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mb-6"
                                placeholder="Nazwa szablonu"
                            />

                            {/* Sekcja alergenów i składników nietolerowanych */}
                            <div className="grid grid-cols-2 gap-8">
                                {/* Kolumna: Alergeny */}
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-lg text-orange-500 mb-4 text-center">Alergeny</h3>
                                    <div
                                        className="flex flex-wrap gap-2 p-4 border rounded-md overflow-y-auto max-h-96 bg-gray-50"
                                        style={{
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#d1d5db #f9fafb",
                                        }}
                                    >
                                        {allergens
                                            .filter((allergen) => allergen.allergenType === "ALLERGEN")
                                            .map((allergen) => (
                                                <button
                                                    key={allergen.allergen_id}
                                                    onClick={() => toggleAllergenSelection(allergen.allergen_id as string)}
                                                    className={`px-4 py-2 rounded-full text-sm border 
                                            ${editAllergens.has(allergen.allergen_id as string)
                                                        ? "bg-orange-500 text-white border-orange-500"
                                                        : "bg-gray-200 border-gray-300"}`}
                                                >
                                                    {allergen.name}
                                                </button>
                                            ))}
                                    </div>
                                </div>

                                {/* Kolumna: Składniki nietolerowane */}
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
                                        {allergens
                                            .filter((allergen) => allergen.allergenType === "INTOLERANT_INGREDIENT")
                                            .map((allergen) => (
                                                <button
                                                    key={allergen.allergen_id}
                                                    onClick={() => toggleAllergenSelection(allergen.allergen_id as string)}
                                                    className={`px-4 py-2 rounded-full text-sm border 
                                            ${editAllergens.has(allergen.allergen_id as string)
                                                        ? "bg-blue-500 text-white border-blue-500"
                                                        : "bg-gray-200 border-gray-300"}`}
                                                >
                                                    {allergen.name}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* Przyciski akcji */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleEditSubmit}
                                    className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transform transition-all duration-300 hover:scale-110"
                                >
                                    <FiCheckCircle className="text-2xl"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <ToastContainer/>
        </div>
    );
};

export default SchemasPage;
