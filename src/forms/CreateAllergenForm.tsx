import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import axiosInstance from "../api/axiosConfig.ts";
import { getAllAllergens } from "../api/api.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../utils/toastify.css";
import { z } from "zod";
import { FaPlus, FaPen, FaTrash, FaSpinner } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

type CreateAllergenDTO = components["schemas"]["CreateAllergenDTO"];

export function CreateAllergenForm() {
    const [loading, setLoading] = useState(false);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [selectedAllergen, setSelectedAllergen] = useState<components["schemas"]["GetAllergenDTO"] | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"edit" | "delete" | null>(null);

    const [createAllergenName, setCreateAllergenName] = useState<string>("");
    const [editAllergenName, setEditAllergenName] = useState<string>("");

    const [createAllergen, setCreateAllergen] = useState<CreateAllergenDTO>({
        name: "",
        type: "INTOLERANT_INGREDIENT",
    });

    const createAllergenSchema = z.object({
        name: z
            .string()
            .min(1, { message: "Nazwa alergenu jest wymagana." })
            .max(50, { message: "Nazwa alergenu nie może przekroczyć 50 znaków." })
            .regex(/^[A-Za-ząćęłńóśżźĄĆĘŁŃÓŚŻŹ\s]+$/, { message: "Nazwa alergenu może zawierać tylko litery i spacje." }),
        type: z.enum(["ALLERGEN", "INTOLERANT_INGREDIENT"], {
            errorMap: () => ({ message: "Nieprawidłowy typ alergenu." }),
        }),
    });


    useEffect(() => {
        fetchAllergens();
    }, []);

    const fetchAllergens = async () => {
        try {
            const allergensData = await getAllAllergens();
            setAllergens(allergensData);
        } catch (error) {
            console.log("Error fetching allergens:", error, loading);
            toast.error("Nie udało się wyświetlić alergenów");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "createName") {
            setCreateAllergenName(value);
        }

        if (name === "editName") {
            setEditAllergenName(value);
        }

        setCreateAllergen((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            createAllergenSchema.parse({ name: createAllergenName, type: createAllergen.type });

            await axiosInstance.post("/allergens/add", {
                name: createAllergenName,
                type: createAllergen.type,
            });

            toast.success("Alergen został stworzony pomyślnie");
            setCreateAllergenName("");
            setCreateAllergen({ name: "", type: "ALLERGEN" });
            setShowCreateModal(false);
            await fetchAllergens();
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = err.errors.reduce((acc, error) => {
                    if (error.path[0] === "name") acc.name = error.message;
                    return acc;
                }, {} as { name?: string });
                toast.error(fieldErrors.name);
            } else {
                toast.error("Nie udało się stworzyć alergenu");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        if (selectedAllergen) {
            try {
                await axiosInstance.put(`/allergens/edit/${selectedAllergen.allergen_id}`, {
                    name: editAllergenName,
                    type: selectedAllergen.allergenType,
                });

                toast.success("Edycja alergenu powiodła się");
                setShowActionModal(false);
                setConfirmAction(null);
                fetchAllergens();
            } catch (error) {
                console.error("Error updating allergen:", error);
                toast.error("Edycja alergenu nie powiodła się");
            }
        }
    };

    const handleDelete = async () => {
        if (selectedAllergen && selectedAllergen.allergen_id) {
            try {
                await axiosInstance.delete(`/allergens/remove/${selectedAllergen.allergen_id}`);
                toast.success("Usunięcie alergenu powiodło się");
                fetchAllergens();
                setShowActionModal(false);
                setConfirmAction(null);
                setSelectedAllergen(null);
            } catch (error) {
                console.error("Error deleting allergen:", error);
                toast.error("Usunięcie alergenu nie powiodło się");
            }
        }
    };

    const handleSelectAllergen = (allergen: components["schemas"]["GetAllergenDTO"]) => {
        setSelectedAllergen(allergen);
        setEditAllergenName(allergen.name as string); // Używamy editAllergenName w trybie edycji
        setShowActionModal(true);
        setConfirmAction("edit");
    };

    const handleCloseModal = () => {
        setShowActionModal(false);
        setConfirmAction(null);
        setSelectedAllergen(null);
    };



    const allergensType1 = allergens.filter((allergen) => allergen.allergenType === "ALLERGEN");
    const allergensType2 = allergens.filter((allergen) => allergen.allergenType === "INTOLERANT_INGREDIENT");

    return (
        <div className="relative">

            <div className="flex w-full p-6">
            <div className="pr-18 mb-6 ">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-500 text-white p-4 rounded-full flex items-center justify-center w-full"
                >
                    <FaPlus className="text-white text-2xl" />
                </button>
            </div>

            <div className="pl-10 w-[80%]">
                <h3 className="text-xl font-semibold mb-4 text-orange-600">Alergeny</h3>
                <div className="flex flex-wrap gap-4">
                    {allergensType1.length > 0 ? (
                        allergensType1.map((allergen) => (
                            <div
                                key={allergen.allergen_id}
                                className="cursor-pointer bg-white text-black border border-orange-600 px-6 py-2 rounded-full hover:scale-110 transition-all duration-300 ease-in-out"
                                onClick={() => handleSelectAllergen(allergen)}
                            >
                                {allergen.name}
                            </div>
                        ))
                    ) : (
                        <FaSpinner className="text-orange-600 text-4xl animate-spin mx-auto mt-4" />
                    )}
                </div>

                <h3 className="text-xl font-semibold mb-4 text-blue-500 mt-8">Nietolerowane składniki</h3>
                <div className="flex flex-wrap gap-4">
                    {allergensType2.length > 0 ? (
                        allergensType2.map((allergen) => (
                            <div
                                key={allergen.allergen_id}
                                className="cursor-pointer bg-white text-black border border-blue-600 px-6 py-2 rounded-full hover:scale-110 transition-all duration-300 ease-in-out"
                                onClick={() => handleSelectAllergen(allergen)}
                            >
                                {allergen.name}
                            </div>
                        ))
                    ) : (
                        <FaSpinner className="text-orange-600 text-4xl animate-spin mx-auto mt-4" />
                    )}
                </div>
            </div>

            <ToastContainer />

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto relative">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-2 right-2 text-black text-3xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-black">Stwórz alergen lub nietolerowany składnik</h3>
                        <form onSubmit={handleSubmit} className="flex-col space-y-4 mb-16">
                            <input
                                type="text"
                                name="createName"
                                value={createAllergenName}
                                onChange={handleChange}
                                placeholder="nazwa"
                                required
                                className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <select
                                name="type"
                                value={createAllergen.type}
                                onChange={handleChange}
                                required
                                className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="ALLERGEN">Alergen</option>
                                <option value="INTOLERANT_INGREDIENT">Nietolerowany składnik</option>
                            </select>
                        </form>

                        <div className="absolute bottom-6 right-6 flex gap-4">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="bg-orange-500 text-white p-4 rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 ease-in-out"
                            >
                                <FiCheckCircle className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showActionModal && selectedAllergen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-black text-3xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-black">
                            {confirmAction === "edit" ? "Edytuj " : "Czy na pewno chcesz usunąć alergen?"}
                        </h3>
                        {confirmAction === "edit" && (
                            <div className="flex-col space-y-4 mb-16">
                                <input
                                    type="text"
                                    name="editName"
                                    value={editAllergenName}
                                    onChange={handleChange}
                                    placeholder="nazwa alergenu"
                                    required
                                    className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <select
                                    name="type"
                                    value={createAllergen.type}
                                    onChange={handleChange}
                                    required
                                    className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="ALLERGEN">Alergen</option>
                                    <option value="INTOLERANT_INGREDIENT">Nietolerowany składnik</option>
                                </select>
                            </div>
                        )}

                        <div className="absolute bottom-6 right-6 flex gap-4">
                            <button
                                onClick={handleEditSave}
                                className="bg-orange-500 text-white p-4 rounded-full w-14 h-14 flex items-center justify-center"
                            >
                                <FaPen className="text-2xl" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white p-4 rounded-full w-14 h-14 flex items-center justify-center"
                            >
                                <FaTrash className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
