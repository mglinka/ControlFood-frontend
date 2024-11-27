import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import axiosInstance from "../api/axiosConfig.ts";
import { getAllAllergens } from "../api/api.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../utils/toastify.css";
import { z } from "zod";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";  // Import ikon z React Icons
import { FiCheckCircle, FiLoader } from "react-icons/fi"; // Import the FiLoader spinner icon

export function CreateAllergenForm() {
    const [createAllergen, setCreateAllergen] = useState<{ name: string }>({ name: "" }); // Zmieniono typ stanu na { name: string }
    const [loading, setLoading] = useState(false);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [selectedAllergen, setSelectedAllergen] = useState<components["schemas"]["GetAllergenDTO"] | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"edit" | "delete" | null>(null);

    const createAllergenSchema = z.object({
        name: z
            .string()
            .min(1, { message: "Allergen name is required." })
            .max(50, { message: "Allergen name cannot exceed 50 characters." })
            .regex(/^[A-Za-ząćęłńóśżźĄĆĘŁŃÓŚŻŹ\s]+$/, { message: "Allergen name can only contain letters (including Polish characters) and spaces." })
    });

    useEffect(() => {
        fetchAllergens();
    }, []);

    const fetchAllergens = async () => {
        try {
            const allergensData = await getAllAllergens();
            setAllergens(allergensData);
        } catch (error) {
            console.log("Error fetching allergens:", error);
            toast.error("Failed to fetch allergens.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateAllergen((prev) => ({ ...prev, [name]: value || "" })); // Zapewniamy, że name nie będzie undefined
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            createAllergenSchema.parse(createAllergen);
            await axiosInstance.post("/allergens/add", createAllergen);
            toast.success("Allergen created successfully!");
            setCreateAllergen({ name: "" }); // Resetowanie stanu po sukcesie
            setShowCreateModal(false); // Zamknięcie modal po utworzeniu alergenu
            await fetchAllergens();
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: { name?: string } = {};
                err.errors.forEach((error) => {
                    if (error.path[0] === "name") {
                        fieldErrors.name = error.message;
                    }
                });
                toast.error(fieldErrors.name);
            } else {
                toast.error("Failed to create allergen. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        if (selectedAllergen && createAllergen.name.trim()) {
            try {
                await axiosInstance.put(`/allergens/edit/${selectedAllergen.allergen_id}`, { name: createAllergen.name });
                toast.success("Allergen updated successfully!");
                setShowActionModal(false);
                setConfirmAction(null);
                fetchAllergens();
            } catch (error) {
                console.error("Error updating allergen:", error);
                toast.error("Failed to update allergen. Please try again.");
            }
        } else {
            toast.error("Allergen name cannot be empty.");
        }
    };

    const handleDelete = async () => {
        if (selectedAllergen && selectedAllergen.allergen_id) {
            try {
                await axiosInstance.delete(`/allergens/remove/${selectedAllergen.allergen_id}`);
                toast.success("Allergen deleted successfully!");
                fetchAllergens();
                setShowActionModal(false);
                setConfirmAction(null);
                setSelectedAllergen(null);
            } catch (error) {
                console.error("Error deleting allergen:", error);
                toast.error("Failed to delete allergen.");
            }
        }
    };

    const handleSelectAllergen = (allergen: components["schemas"]["GetAllergenDTO"]) => {
        setSelectedAllergen(allergen);
        setShowActionModal(true);
    };

    const handleCloseModal = () => {
        setShowActionModal(false);
        setConfirmAction(null);
        setSelectedAllergen(null);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between p-6">
            {/* Left Column - Allergen Actions */}
            <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-4 text-orange-600">Allergen Actions</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-orange-500 text-white p-4 rounded-full flex items-center"
                >
                    <FaPlus className="text-white text-2xl" /> {/* Add icon for creating allergen */}
                </button>
            </div>

            {/* Right Column - Allergens List */}
            <div className="w-full md:w-1/2 md:pl-4">
                <h3 className="text-xl font-semibold mb-4 text-orange-600">Allergens List</h3>
                <div className="flex flex-wrap gap-3">
                    {allergens.length > 0 ? (
                        allergens.map((allergen) => (
                            <div
                                key={allergen.allergen_id}
                                className="cursor-pointer px-4 py-2 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 transition-all duration-300"
                                onClick={() => handleSelectAllergen(allergen)}
                            >
                                {allergen.name}
                            </div>
                        ))
                    ) : (
                        <p>No allergens available.</p>
                    )}
                </div>
            </div>

            <ToastContainer />

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    {/* Modal Content */}
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto relative">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-2 right-2 text-black text-3xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-orange-600">Create Allergen</h3>
                        <form onSubmit={handleSubmit} className=" flex-col space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={createAllergen.name}
                                onChange={handleChange}
                                placeholder="Allergen Name"
                                required
                                className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 text-white px-6 py-2 rounded flex items-center justify-center ml-auto"
                                disabled={loading}
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin text-2xl" /> // Show spinning loader when submitting
                                ) : (
                                    <FiCheckCircle className="text-2xl" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Edit/Delete */}
            {showActionModal && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-orange-600 text-xl"
                        >
                            <FaTrash size={24} /> {/* Close icon */}
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-orange-600">
                            {confirmAction === "edit" ? "Edit Allergen" : "Confirm Deletion"}
                        </h3>
                        <div>
                            {confirmAction === "edit" ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={createAllergen.name}
                                        onChange={handleChange}
                                        placeholder="Allergen Name"
                                        className="p-3 border rounded-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        onClick={handleEditSave}
                                        className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p>Are you sure you want to delete {selectedAllergen.name}?</p>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
