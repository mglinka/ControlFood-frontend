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
    const [allergens, setAllergens] = useState<components["schemas"]["CreateAllergenDTO"][]>([]);
    const [selectedAllergen, setSelectedAllergen] = useState<components["schemas"]["GetAllergenDTO"] | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // New state for confirmation

    const createAllergenSchema = z.object({
        name: z
            .string()
            .min(1, { message: "Allergen name is required." })
            .max(50, { message: "Allergen name cannot exceed 50 characters." })
            .regex(/^[A-Za-z\s]+$/, { message: "Allergen name can only contain letters and spaces." })
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
            toast.success('Allergen created successfully!');
            setCreateAllergen({ name: '' });
            fetchAllergens();
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

    const handleEdit = () => {
        if (selectedAllergen) {
            setCreateAllergen({ name: selectedAllergen.name });
            setShowModal(true);
        }
    };

    const handleDelete = async () => {
        if (selectedAllergen && selectedAllergen.allergen_id) {
            console.log("Deleting allergen with ID:", selectedAllergen.allergen_id);
            try {
                await axiosInstance.delete(`/allergens/remove/${selectedAllergen.allergen_id}`);
                toast.success('Allergen deleted successfully!');
                fetchAllergens();
                setShowConfirmDelete(false); // Close confirm dialog
                setSelectedAllergen(null); // Clear selected allergen after deletion
            } catch (error) {
                console.error("Error deleting allergen:", error);
                toast.error('Failed to delete allergen.');
            }
        } else {
            console.error("No allergen selected for deletion or ID is undefined.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAllergen(null); // Clear selected allergen when closing
    };

    return (
        <div className="flex flex-col md:flex-row justify-between p-6">
            {/* Left Column */}
            <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">Create Allergen</h2>
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
                        className={`py-2 px-4 rounded ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                        {loading ? 'Creating...' : 'Create Allergen'}
                    </button>
                </form>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 md:pl-4">
                <h3 className="text-xl font-semibold mb-4 text-blue-700">Allergens List</h3>
                <div className="overflow-auto h-[calc(100vh-120px)]">
                    {allergens.length > 0 ? (
                        <ul className="space-y-2">
                            {allergens.map((allergen) => (
                                <li
                                    key={allergen.name}
                                    className="p-2 border rounded bg-blue-100 cursor-pointer hover:bg-blue-200"
                                    onClick={() => {
                                        console.log("Selected allergen:", allergen); // Debugging line
                                        setSelectedAllergen(allergen);
                                        setShowModal(true);
                                    }}
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

            {showModal && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-blue-700 text-xl"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-blue-700">Manage Allergen</h3>
                        <div className="mb-4">
                            <p>Are you sure you want to edit or delete this allergen?</p>
                            <p>Name: {selectedAllergen.name}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false); // Close main modal
                                    setShowConfirmDelete(true); // Open confirmation dialog
                                }}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmDelete && selectedAllergen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setShowConfirmDelete(false)} // Close confirmation dialog
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
                                onClick={() => setShowConfirmDelete(false)} // Cancel deletion
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
