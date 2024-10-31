import { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import { getAllUnits } from "../api/api.ts";
import Select from "react-select";

type UnitDTO = components["schemas"]["UnitDTO"];
type CreateProductDTO = components["schemas"]["CreateProductDTO"];

export function CreateProductForm() {
    const [units, setUnits] = useState<UnitDTO[]>([]);

    const [createProduct, setCreateProduct] = useState<CreateProductDTO>({
        ean: "",
        producerDTO: { name: "", address: "", countryCode: 0, contact: "", nip: "", rmsd: 0 },
        productName: "",
        productDescription: "",
        productQuantity: undefined,
        unitDTO: { name: "" },
        packageTypeDTO: { name: "" },
        country: "",
        compositionDTO: { ingredientDTOS: [], additionDTOS: [], flavourDTO: { name: "" } },
        nutritionalIndexDTOS: [],
        productIndexDTOS: [],
        labelDTO: { storage: "", durability: "", instructionsAfterOpening: "", preparation: "", allergens: "", image: "" },
        portionDTO: { portionQuantity: undefined, unitDTO: { name: ""} },
        ratingDTOS: [],
        nutritionalValueDTOS: []
    });

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            const unitsData = await getAllUnits();
            setUnits(unitsData);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCreateProduct((prev) => {
            const keys = name.split(".");
            if (keys.length === 1) {
                return { ...prev, [name]: value };
            } else {
                const [first, ...rest] = keys;

                const firstObj = prev[first as keyof typeof createProduct];

                if (typeof firstObj === 'object' && firstObj !== null) {
                    return {
                        ...prev,
                        [first]: {
                            ...firstObj,
                            [rest.join(".")]: value,
                        },
                    };
                }
                console.error(`Expected an object for key: ${first}, but got:`, firstObj);
                return prev;
            }
        });
    };

    const handleUnitChange = (selectedOption: any) => {
        if (selectedOption) {
            setCreateProduct((prev) => ({
                ...prev,
                unitDTO: {

                    name: selectedOption.label,
                },
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Product Created: ", createProduct);
    };

    const unitOptions = units.map((unit) => ({

        label: unit.name,
    }));

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Create Product</h2>

            <div className="mb-6">
                <label className="block mb-1 font-semibold">EAN:</label>
                <input
                    type="text"
                    name="ean"
                    value={createProduct.ean}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    required
                />
            </div>


            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Producer Information</h3>
                <label className="block mb-1">Name:</label>
                <input
                    type="text"
                    name="producerDTO.name"
                    value={createProduct.producerDTO.name}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Address:</label>
                <input
                    type="text"
                    name="producerDTO.address"
                    value={createProduct.producerDTO.address}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Country Code:</label>
                <input
                    type="number"
                    name="producerDTO.countryCode"
                    value={createProduct.producerDTO.countryCode}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Contact:</label>
                <input
                    type="text"
                    name="producerDTO.contact"
                    value={createProduct.producerDTO.contact}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">NIP:</label>
                <input
                    type="text"
                    name="producerDTO.nip"
                    value={createProduct.producerDTO.nip}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">RMSD:</label>
                <input
                    type="number"
                    name="producerDTO.rmsd"
                    value={createProduct.producerDTO.rmsd}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>


            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Product Details</h3>
                <label className="block mb-1">Product Name:</label>
                <input
                    type="text"
                    name="productName"
                    value={createProduct.productName}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Product Description:</label>
                <textarea
                    name="productDescription"
                    value={createProduct.productDescription}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    rows={3}
                />
                <label className="block mb-1">Product Quantity:</label>
                <input
                    type="number"
                    name="productQuantity"
                    value={createProduct.productQuantity || ""}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-1">Unit:</label>
                <Select
                    options={unitOptions}
                    onChange={handleUnitChange}
                    className="w-full"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-1">Package Type:</label>
                <input
                    type="text"
                    name="packageTypeDTO.name"
                    value={createProduct.packageTypeDTO?.name}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-1">Country:</label>
                <input
                    type="text"
                    name="country"
                    value={createProduct.country}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Composition</h3>
                <label className="block mb-1">Ingredients (comma-separated):</label>
                <textarea
                    name="compositionDTO.ingredientDTOS"
                    value={createProduct.compositionDTO?.ingredientDTOS?.map((ing) => ing.name).join(", ") || ""}
                    onChange={(e) => {
                        const ingredients = e.target.value.split(", ").map(name => ({ name }));
                        setCreateProduct((prev) => ({
                            ...prev,
                            compositionDTO: { ...prev.compositionDTO, ingredientDTOS: ingredients }
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. sugar, salt, water"
                />
                <label className="block mb-1">Additions (comma-separated):</label>
                <textarea
                    name="compositionDTO.additionDTOS"
                    value={createProduct.compositionDTO?.additionDTOS?.map((add) => add.name).join(", ") || ""}
                    onChange={(e) => {
                        const additions = e.target.value.split(", ").map(name => ({ name }));
                        setCreateProduct((prev) => ({
                            ...prev,
                            compositionDTO: { ...prev.compositionDTO, additionDTOS: additions }
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. vanilla, citric acid"
                />
                <label className="block mb-1">Flavour:</label>
                <input
                    type="text"
                    name="compositionDTO.flavourDTO.name"
                    value={createProduct.compositionDTO?.flavourDTO?.name}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Nutritional Indexes</h3>
                <textarea
                    name="nutritionalIndexDTOS"
                    value={createProduct.nutritionalIndexDTOS?.map(index => `${index.indexValue}: ${index.legend}`).join(", ") || ""}
                    onChange={(e) => {
                        const nutritionalIndexes = e.target.value.split(", ").map((entry) => {
                            const [indexValue, legend] = entry.split(": ");
                            return { indexValue: parseInt(indexValue), legend };
                        });
                        setCreateProduct((prev) => ({
                            ...prev,
                            nutritionalIndexDTOS: nutritionalIndexes
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. 100: calories, 5: fat"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Product Indexes</h3>
                <textarea
                    name="productIndexDTOS"
                    value={createProduct.productIndexDTOS?.map(index => `${index.indexName}: ${index.indexValue}`).join(", ") || ""}
                    onChange={(e) => {
                        const productIndexes = e.target.value.split(", ").map((entry) => {
                            const [indexName, indexValue] = entry.split(": ");
                            return { indexName, indexValue: parseInt(indexValue) };
                        });
                        setCreateProduct((prev) => ({
                            ...prev,
                            productIndexDTOS: productIndexes
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. Index 1: 80, Index 2: 50"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Label Information</h3>
                <label className="block mb-1">Storage:</label>
                <input
                    type="text"
                    name="labelDTO.storage"
                    value={createProduct.labelDTO?.storage}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Durability:</label>
                <input
                    type="text"
                    name="labelDTO.durability"
                    value={createProduct.labelDTO?.durability}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Instructions After Opening:</label>
                <textarea
                    name="labelDTO.instructionsAfterOpening"
                    value={createProduct.labelDTO?.instructionsAfterOpening}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    rows={3}
                />
                <label className="block mb-1">Preparation:</label>
                <textarea
                    name="labelDTO.preparation"
                    value={createProduct.labelDTO?.preparation}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    rows={3}
                />
                <label className="block mb-1">Allergens:</label>
                <textarea
                    name="labelDTO.allergens"
                    value={createProduct.labelDTO?.allergens}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                    rows={3}
                />
                <label className="block mb-1">Image URL:</label>
                <input
                    type="text"
                    name="labelDTO.image"
                    value={createProduct.labelDTO?.image}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Portion Information</h3>
                <label className="block mb-1">Portion Quantity:</label>
                <input
                    type="number"
                    name="portionDTO.portionQuantity"
                    value={createProduct.portionDTO?.portionQuantity || ""}
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                />
                <label className="block mb-1">Portion Unit:</label>
                <Select
                    options={unitOptions}
                    onChange={(selectedOption) => {
                        if (selectedOption) {
                            setCreateProduct((prev) => ({
                                ...prev,
                                portionDTO: { ...prev.portionDTO, unitDTO: { id: selectedOption.valueOf(), name: selectedOption.label } }
                            }));
                        }
                    }}
                    className="w-full"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Ratings</h3>
                <textarea
                    name="ratingDTOS"
                    value={createProduct.ratingDTOS?.map(rating => `${rating.groupName}: ${rating.name}`).join(", ") || ""}
                    onChange={(e) => {
                        const ratings = e.target.value.split(", ").map((entry) => {
                            const [groupName, name] = entry.split(": ");
                            return { groupName, name, products: [] };
                        });
                        setCreateProduct((prev) => ({
                            ...prev,
                            ratingDTOS: ratings
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. Group 1: Rating A, Group 2: Rating B"
                />
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Nutritional Values</h3>
                <textarea
                    name="nutritionalValueDTOS"
                    value={createProduct.nutritionalValueDTOS?.map(value => `${value.nutritionalValueName?.name}: ${value.quantity} ${value.unit?.name}`).join(", ") || ""}
                    onChange={(e) => {
                        const nutritionalValues = e.target.value.split(", ").map((entry) => {
                            const [name, quantityWithUnit] = entry.split(": ");
                            const [quantity, unitName] = quantityWithUnit.split(" ");
                            return {
                                nutritionalValueName: { name },
                                quantity: parseFloat(quantity),
                                unit: { name: unitName }
                            };
                        });
                        setCreateProduct((prev) => ({
                            ...prev,
                            nutritionalValueDTOS: nutritionalValues
                        }));
                    }}
                    className="border rounded-lg p-3 w-full"
                    placeholder="e.g. Vitamin C: 30 mg, Iron: 5 mg"
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-200">
                Create Product
            </button>
        </form>
    );
}
