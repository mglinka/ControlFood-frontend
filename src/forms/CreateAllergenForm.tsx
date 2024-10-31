import { useState } from "react";
import { components } from "../controlfood-backend-schema";
import axiosInstance from "../api/axiosConfig.ts";

export function CreateAllergenForm() {
    const [createAllergen, setCreateAllergen] = useState<components["schemas"]["CreateAllergenDTO"]>({ name: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateAllergen((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error
        setLoading(true); // Start loading state

        try {
            const response = await axiosInstance.post('/allergens/add', createAllergen, {

            });

            console.log("Allergen Created:", response.data);
            setSuccessMessage('Allergen created successfully!');
            setCreateAllergen({ name: '' });
        } catch (err) {
            console.error("Error creating allergen:", err);
            setError('Failed to create allergen. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Allergen</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="name"
                    value={createAllergen.name}
                    onChange={handleChange}
                    placeholder="Allergen Name"
                    required
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 px-4 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
                >
                    {loading ? 'Creating...' : 'Create Allergen'}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        </div>
    );
};
