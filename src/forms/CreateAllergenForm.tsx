import { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import axiosInstance from "../api/axiosConfig.ts";
import { getAllAllergens } from "../api/api.ts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../utils/toastify.css';
import { z } from "zod";



export function CreateAllergenForm() {
    const [createAllergen, setCreateAllergen] = useState<components["schemas"]["CreateAllergenDTO"]>({ name: '' });
    const [loading, setLoading] = useState(false);
    const [allergens, setAllergens] = useState<components["schemas"]["GetAllergenDTO"][]>([]);
    const [selectedAllergen, setSelectedAllergen] = useState<components["schemas"]["GetAllergenDTO"] | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
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
        setCreateAllergen((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            createAllergenSchema.parse(createAllergen);
            await axiosInstance.post('/allergens/add', createAllergen);
            console.log("TU", createAllergen);
            toast.success('Allergen created successfully!');
            setCreateAllergen({ name: '' });
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
                toast.error('Failed to create allergen. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        if (selectedAllergen && createAllergen.name?.trim()) {
            try {
                await axiosInstance.put(`/allergens/edit/${selectedAllergen.allergen_id}`, { name: createAllergen.name });
                toast.success('Allergen updated successfully!');
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
                toast.success('Allergen deleted successfully!');
                fetchAllergens();
                setShowActionModal(false);
                setConfirmAction(null);
                setSelectedAllergen(null);
            } catch (error) {
                console.error("Error deleting allergen:", error);
                toast.error('Failed to delete allergen.');
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
            <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-4 text-black">Create Allergen</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        name="name"
                        value={createAllergen.name}
                        onChange={handleChange}
                        placeholder="Allergen Name"
                        required
                        className="mb-4 p-2 border border-blue-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 rounded ${loading ? 'bg-orange-500' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
                    >
                        {loading ? 'Creating...' : 'Create Allergen'}
                    </button>
                </form>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 md:pl-4">
                <h3 className="text-xl font-semibold mb-4 text-orange-600">Allergens List</h3>
                <div className="overflow-auto h-[calc(100vh-120px)]">
                    {allergens.length > 0 ? (
                        <ul className="space-y-2">
                            {allergens.map((allergen) => (
                                <li
                                    key={allergen.allergen_id}
                                    className="p-2 border rounded bg-blue-100 cursor-pointer hover:bg-blue-200"
                                    onClick={() => handleSelectAllergen(allergen)}
                                >
                                    {allergen.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No allergens available.</p>
                    )}
                </div>
            </div>

            <ToastContainer />

            {showActionModal && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-blue-700 text-xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-black">Manage Allergen</h3>
                        <p>Do you want to edit or delete allergen: <strong>{selectedAllergen.name}</strong></p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => {
                                    setConfirmAction("edit");
                                    setShowActionModal(false);
                                }}
                                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmAction("delete");
                                    setShowActionModal(false);
                                }}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction === "edit" && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setConfirmAction(null)}
                            className="absolute top-2 right-2 text-blue-700 text-xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-black">Edit Allergen</h3>
                        <input
                            type="text"
                            value={createAllergen.name}
                            onChange={handleChange}
                            name="name"
                            className="mb-4 p-2 border border-blue-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                        <div className="flex justify-center gap-4 w-full mt-6">
                            <button
                                onClick={handleEditSave}
                                className="bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="bg-gray-300 text-black py-3 px-6 rounded-lg text-lg hover:bg-gray-400 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmAction === "delete" && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setConfirmAction(null)}
                            className="absolute top-2 right-2 text-blue-700 text-xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-red-500">Confirm Deletion</h3>
                        <p>Are you sure you want to delete the allergen: <strong>{selectedAllergen.name}</strong>?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
