import { useState } from "react";
import { components } from "../controlfood-backend-schema";

export function CreateAllergenForm() {
    const [createAllergen, setCreateAllergen] = useState<components["schemas"]["CreateAllergenDTO"]>({
        name: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateAllergen((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Allergen Created:", createAllergen);
        // Here you can add logic to send the `createAllergen` data to your API.
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Create Allergen</h2>

            {/* Allergen Name Field */}
            <div className="mb-6">
                <label className="block mb-1 font-semibold">Allergen Name:</label>
                <input
                    type="text"
                    name="name"
                    value={createAllergen.name}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
            >
                Create Allergen
            </button>
        </form>
    );
}
