import { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import {getAllUnits, getNutritionalValueGroups, getNutritionalValueNames} from "../api/api.ts";
import Select from "react-select";
import axiosInstance from "../api/axiosConfig.ts";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../utils/toastify.css'
import { z } from "zod";

type UnitDTO = components["schemas"]["UnitDTO"];
type NutritionalValueNameDTO = components["schemas"]["NutritionalValueNameDTO"];
type NutritionalValueGroupDTO = components["schemas"]["NutritionalValueGroupDTO"];
type CreateProductDTO = components["schemas"]["CreateProductDTO"];
type RatingDTO = components["schemas"]["RatingDTO"];
type NutritionalValueDTO = components["schemas"]["NutritionalValueDTO"];

export function CreateProductForm() {
    const [units, setUnits] = useState<UnitDTO[]>([]);
    const [nutritionalValueNames, setNutritionalValueNames] = useState<NutritionalValueNameDTO[]>([]);
    const [nutritionalValueGroups, setNutritionalValueGroups] = useState<NutritionalValueGroupDTO[]>([]);
    const ProducerSchema = z.object({
        name: z.string().min(1, "Producer name cannot be blank").max(100, "Producer name must be 100 characters or less"),
        address: z.string().min(1, "Address cannot be blank").max(255, "Address must be 255 characters or less"),
        countryCode: z.number().min(1, "Country code must be a positive integer").max(999, "Country code must be a valid ISO country code (1-999)"),
        contact: z.string().email("Contact must be a valid email format"),
        nip: z.string().length(10, "NIP must be exactly 10 digits"),
        rmsd: z.number().positive("RMSD must be a positive integer"),
    });

    const CreateProductSchema = z.object({
        ean: z.string().length(13, "EAN must be exactly 13 digits"),
        producerDTO: ProducerSchema,
        productName: z.string().min(1, "Product name cannot be null").max(100, "Product name must be between 1 and 100 characters"),
        productDescription: z.string().max(255, "Product description must be 255 characters or less").optional(),
        productQuantity: z.number().min(0, "Product quantity must be zero or greater"),
        unitDTO: z.object({
            name: z.string(),
        }),
        packageTypeDTO: z.object({
            name: z.string(),
        }),
        country: z.string().nonempty("Country cannot be blank"),
        labelDTO: z.object({
            storage: z.string().optional(),
            durability: z.string().optional(),
            instructionsAfterOpening: z.string().optional(),
            preparation: z.string().optional(),
            allergens: z.string().optional(),
            image: z.string().optional(),
        }).optional(),
        portionDTO: z.object({
            portionQuantity: z.number().optional(),
            unitDTO: z.object({
                name: z.string(),
            }),
        }).optional(),
    });

    const [createProduct, setCreateProduct] = useState<CreateProductDTO>({
        ean: "",
        producerDTO: { name: "", address: "", countryCode: 0, contact: "", nip: "", rmsd: 0 },
        productName: "",
        productDescription: "",
        productQuantity: undefined,
        unitDTO: { name: "" },
        packageTypeDTO: { name: "" },
        country: "",
        labelDTO: { storage: "", durability: "", instructionsAfterOpening: "", preparation: "", allergens: "", image: "" },
        portionDTO: { portionQuantity: undefined, unitDTO: { name: "" } },
        compositionDTO: { ingredientDTOS: [], additionDTOS: [], flavourDTO: { name: "" } },
        nutritionalIndexDTOS: [],
        productIndexDTOS: [],
        ratingDTOS: [],
        nutritionalValueDTOS: [],
    });

    useEffect(() => {
        fetchUnits();
        fetchNutritionalValueNames();
        fetchNutritionalValueGroups();
        console.log("Start", nutritionalValueNames);
    }, []);



    const fetchUnits = async () => {
        try {
            const unitsData = await getAllUnits();
            setUnits(unitsData);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };
    const fetchNutritionalValueNames = async ()=>{
        try {
            const nutritionalValueNameData = await getNutritionalValueNames();
            console.log("Tutaj", nutritionalValueNameData)
            setNutritionalValueNames(nutritionalValueNameData);
            console.log("po", nutritionalValueNames)

        }
        catch (error){
            console.log("Error fetching nutritional value names", error);
        }
    }

    const fetchNutritionalValueGroups = async ()=>{
        try {
            const nutritionalValueData = await getNutritionalValueGroups();
            console.log("Tutaj", nutritionalValueData)
            setNutritionalValueGroups(nutritionalValueData);
            console.log("po", nutritionalValueGroups)

        }
        catch (error){
            console.log("Error fetching nutritional value ", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let newValue: number | string | undefined;
        if (type === "number") {
            newValue = value !== "" ? parseFloat(value) : undefined;
        } else {
            newValue = value;
        }

        setCreateProduct((prev) => {
            const keys = name.split(".");
            if (keys.length === 1) {
                return { ...prev, [name]: newValue };
            } else {
                const [first, ...rest] = keys;
                const firstObj = prev[first as keyof typeof createProduct];
                if (typeof firstObj === 'object' && firstObj !== null) {
                    return {
                        ...prev,
                        [first]: {
                            ...firstObj,
                            [rest.join(".")]: newValue,
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

    // Opcje jednostek
    const unitOptions = units.map((unit) => ({
        label: unit.name,
        value: unit.name,
    }));


    const handleIngredientChange = (index: number, value: string) => {
        // Ensure ingredientDTOS is always an array
        const currentIngredients = createProduct.compositionDTO?.ingredientDTOS || [];
        const updatedIngredients = [...currentIngredients];
        updatedIngredients[index] = { name: value };

        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                ingredientDTOS: updatedIngredients,
            },
        }));
    };

    const handleAdditionChange = (index: number, value: string) => {
        const updatedAdditions = [...(createProduct.compositionDTO?.additionDTOS || [])];
        updatedAdditions[index] = {
            ...updatedAdditions[index],
            name: value,
        };

        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                additionDTOS: updatedAdditions,
            },
        }));
    };


    const handleAddIngredient = () => {
        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                // Defaulting to an empty array if ingredientDTOS is undefined
                ingredientDTOS: [
                    ...(prev.compositionDTO?.ingredientDTOS || []),
                    { name: "" },
                ],
            },
        }));
    };

    const handleAddAddition = () => {
        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                // Defaulting to an empty array if additionDTOS is undefined
                additionDTOS: [
                    ...(prev.compositionDTO?.additionDTOS || []),
                    { name: "" },
                ],
            },
        }));
    };


    const handleFlavourChange = (value: string) => {
        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                flavourDTO: { name: value },
            },
        }));
    };

    const handleNutritionalIndexChange = (index: number, key: string, value: string | number) => {
        // Use a fallback to an empty array if nutritionalIndexDTOS is undefined
        const updatedIndexes = [...(createProduct.nutritionalIndexDTOS || [])];

        if (key === "indexValue") {
            // Ensure we don't exceed the bounds of the array
            if (index >= 0 && index < updatedIndexes.length) {
                updatedIndexes[index].indexValue = Number(value);
            }
        } else {
            // Ensure we don't exceed the bounds of the array
            if (index >= 0 && index < updatedIndexes.length) {
                updatedIndexes[index].legend = value as string;
            }
        }

        setCreateProduct((prev) => ({
            ...prev,
            nutritionalIndexDTOS: updatedIndexes,
        }));
    };


    const handleAddNutritionalIndex = () => {
        setCreateProduct((prev) => ({
            ...prev,
            // Ensure nutritionalIndexDTOS is always an array
            nutritionalIndexDTOS: [
                ...(prev.nutritionalIndexDTOS || []), // Fallback to empty array if undefined
                { indexValue: 0, legend: "" },
            ],
        }));
    };


    const handleProductIndexChange = (index: number, key: "indexValue" | "indexName", value: string | number) => {
        // Ensure productIndexDTOS is an array before proceeding
        const updatedIndexes = [...(createProduct.productIndexDTOS || [])]; // Fallback to empty array if undefined

        // Update the specific index entry based on the key
        if (key === "indexValue") {
            updatedIndexes[index].indexValue = typeof value === "number" ? value : Number(value);
        } else {
            updatedIndexes[index].indexName = value as string;
        }

        // Update the state with the modified array
        setCreateProduct((prev) => ({
            ...prev,
            productIndexDTOS: updatedIndexes,
        }));
    };

    const handleAddProductIndex = () => {
        setCreateProduct((prev) => ({
            ...prev,
            productIndexDTOS: [
                ...(prev.productIndexDTOS || []), // Fallback to empty array if undefined
                { indexValue: 0, indexName: "" }, // Add new product index
            ],
        }));
    };




    const handleRatingChange = (
        index: number,
        key: "groupName" | "name" | "products",
        value: string | string[]
    ) => {
        // Safely fallback to an empty array if ratingDTOS is undefined
        const updatedRatings: RatingDTO[] = [...(createProduct.ratingDTOS || [])];

        // Handle updating the specific field for the given index
        if (key === "products") {
            updatedRatings[index].products = value as string[];
        } else {
            updatedRatings[index][key] = value as string;
        }

        // Update the state with the new ratings
        setCreateProduct((prev) => ({
            ...prev,
            ratingDTOS: updatedRatings,
        }));
    };

    const handleAddRating = () => {
        setCreateProduct((prev) => ({
            ...prev,
            ratingDTOS: [
                ...(prev.ratingDTOS || []), // Ensure we are spreading an array, default to an empty array if undefined
                { groupName: "", name: "", products: [] }
            ],
        }));
    };



    // Define the handleNutritionalValueChange function with explicit key types to avoid 'any' issues
    const handleNutritionalValueChange = (
        index: number,
        field: keyof NutritionalValueDTO, // Explicitly define field as a keyof NutritionalValueDTO
        value: any
    ) => {
        setCreateProduct((prevProduct) => {
            // Ensure nutritionalValueDTOS is an array, with a fallback to an empty array
            const updatedNutritionalValues = [...(prevProduct.nutritionalValueDTOS || [])];

            // Ensure the item at the specified index exists
            if (!updatedNutritionalValues[index]) {
                updatedNutritionalValues[index] = {} as NutritionalValueDTO; // Create an empty object if needed
            }

            const updatedValue = { ...updatedNutritionalValues[index] };

            // Update the nutritionalValueName with both group and name properties
            if (field === "nutritionalValueName" && typeof value === "object") {
                updatedValue.nutritionalValueName = {
                    ...(updatedValue.nutritionalValueName || {}), // Ensure this exists
                    ...value,
                };
            } else if (field === "quantity" || field === "nrv") {
                updatedValue[field] = value as number; // Ensure correct type
            } else if (field === "unit") {
                updatedValue.unit = { ...value }; // Ensure correct type for unit
            }

            updatedNutritionalValues[index] = updatedValue; // Update the specific item

            return { ...prevProduct, nutritionalValueDTOS: updatedNutritionalValues };
        });
    };

// Define the handleAddNutritionalValue function with an array fallback for nutritionalValueDTOS
    const handleAddNutritionalValue = () => {
        const newNutritionalValue: NutritionalValueDTO = {
            nutritionalValueName: {
                group: { groupName: '' },
                name: '',
            },
            quantity: 0,
            unit: { name: '' },
            nrv: 0,
        };

        setCreateProduct({
            ...createProduct,
            nutritionalValueDTOS: [
                ...(createProduct.nutritionalValueDTOS || []),
                newNutritionalValue,
            ],
        });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            CreateProductSchema.parse(createProduct);

            await axiosInstance.post('/products/add', createProduct);
            toast.success('Product created successfully!');

            setCreateProduct({
                ean: "",
                producerDTO: { name: "", address: "", countryCode: 0, contact: "", nip: "", rmsd: 0 },
                productName: "",
                productDescription: "",
                productQuantity: undefined,
                unitDTO: { name: "" },
                packageTypeDTO: { name: "" },
                country: "",
                labelDTO: { storage: "", durability: "", instructionsAfterOpening: "", preparation: "", allergens: "", image: "" },
                portionDTO: { portionQuantity: undefined, unitDTO: { name: "" } },
                compositionDTO: { ingredientDTOS: [], additionDTOS: [], flavourDTO: { name: "" } },
                nutritionalIndexDTOS: [],
                productIndexDTOS: [],
                ratingDTOS: [],
                nutritionalValueDTOS: [],
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.errors.map((e) => e.message).join(", ");
                toast.error(`Validation Error: ${messages}`);
            } else {
                console.error("Error creating product: ", error);
                if (axios.isAxiosError(error) && error.response) {
                    const statusCode = error.response.status;
                    const errorMessage = error.response.data?.message || "An error occurred";
                    toast.error(`Error ${statusCode}: ${errorMessage}`);
                }
            }
        }
    };


    return (
        <>
            <ToastContainer />
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
                        value={createProduct.producerDTO.countryCode !== undefined ? createProduct.producerDTO.countryCode : ""}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                        required
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
                    <label className="block mb-1 font-semibold">Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={createProduct.productName}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Product Description:</label>
                    <textarea
                        name="productDescription"
                        value={createProduct.productDescription}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Product Quantity:</label>
                    <input
                        type="number"
                        name="productQuantity"
                        value={createProduct.productQuantity || ""}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Unit:</label>
                    <Select
                        options={unitOptions}
                        onChange={handleUnitChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Package Type:</label>
                    <input
                        type="text"
                        name="packageTypeDTO.name"
                        value={createProduct.packageTypeDTO?.name}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Country:</label>
                    <input
                        type="text"
                        name="country"
                        value={createProduct.country}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
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
                    <input
                        type="text"
                        name="labelDTO.instructionsAfterOpening"
                        value={createProduct.labelDTO?.instructionsAfterOpening}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Preparation:</label>
                    <input
                        type="text"
                        name="labelDTO.preparation"
                        value={createProduct.labelDTO?.preparation}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Allergens:</label>
                    <input
                        type="text"
                        name="labelDTO.allergens"
                        value={createProduct.labelDTO?.allergens}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
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
                        onChange={handleUnitChange}
                    />
                </div>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Composition Information</h3>
                    <label className="block mb-1">Ingredients:</label>
                    {createProduct.compositionDTO?.ingredientDTOS?.map((ingredient, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="border rounded-lg p-3 w-full mr-2"
                                placeholder="Ingredient name"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={handleAddIngredient}
                                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">
                            Add Ingredient
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-1">Additions:</label>
                    {createProduct.compositionDTO?.additionDTOS?.map((addition, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={addition.name}
                                onChange={(e) => handleAdditionChange(index, e.target.value)}
                                className="border rounded-lg p-3 w-full mr-2"
                                placeholder="Addition name"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleAddAddition}
                            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">
                            Add Addition
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-1">Flavour:</label>
                    <input
                        type="text"
                        value={createProduct.compositionDTO?.flavourDTO?.name}
                        onChange={(e) => handleFlavourChange(e.target.value)}
                        className="border rounded-lg p-3 w-full"
                        placeholder="Flavour name"
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Nutritional Indexes</h3>
                    {createProduct.nutritionalIndexDTOS?.map((nutritionalIndex, index) => (
                        <div key={index} className="nutritional-index-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1">Index Value:</label>
                            <input
                                type="number"
                                placeholder="Index Value"
                                value={nutritionalIndex.indexValue || ''}
                                onChange={(e) => handleNutritionalIndexChange(index, 'indexValue', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                            <label className="block mb-1">Legend:</label>
                            <input
                                type="text"
                                placeholder="Legend"
                                value={nutritionalIndex.legend || ''}
                                onChange={(e) => handleNutritionalIndexChange(index, 'legend', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={handleAddNutritionalIndex}
                                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">
                            Add Nutritional Index
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Product Indexes</h3>
                    {createProduct.productIndexDTOS?.map((productIndex, index) => (
                        <div key={index} className="product-index-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1">Index Name:</label>
                            <input
                                type="text"
                                placeholder="Index Name"
                                value={productIndex.indexName || ''}
                                onChange={(e) => handleProductIndexChange(index, 'indexName', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                            <label className="block mb-1">Index Value:</label>
                            <input
                                type="number"
                                placeholder="Index Value"
                                value={productIndex.indexValue || ''}
                                onChange={(e) => handleProductIndexChange(index, 'indexValue', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={handleAddProductIndex}
                                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">
                            Add Product Index
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Ratings</h3>
                    {createProduct.ratingDTOS?.map((rating, index) => (
                        <div key={index} className="rating-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1">Group Name:</label>
                            <input
                                type="text"
                                placeholder="Group Name"
                                value={rating.groupName || ''}
                                onChange={(e) => handleRatingChange(index, 'groupName', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                            <label className="block mb-1">Name:</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={rating.name || ''}
                                onChange={(e) => handleRatingChange(index, 'name', e.target.value)}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                            <label className="block mb-1">Products (comma separated):</label>
                            <input
                                type="text"
                                placeholder="Products (comma separated)"
                                value={rating.products?.join(', ') || ''}
                                onChange={(e) => handleRatingChange(index, 'products', e.target.value.split(', ').map(p => p.trim()))}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={handleAddRating}
                                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600">
                            Add Rating
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Nutritional Values</h2>
                    {createProduct.nutritionalValueDTOS?.map((nutritionalValue, index) => (
                        <div key={index} className="nutritional-value-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1">Nutritional Value Name:</label>
                            <select
                                value={nutritionalValue.nutritionalValueName?.name || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'nutritionalValueName', {name: e.target.value})}
                                className="border rounded-lg p-3 w-full mb-2"
                            >
                                <option value="">Select Nutritional Value Name</option>
                                {nutritionalValueNames.map((nv) => (
                                    <option key={nv.name} value={nv.name}>
                                        {nv.name}
                                    </option>
                                ))}
                            </select>

                            typescript
                            <label className="block mb-1">Group Name:</label>
                            <select
                                value={nutritionalValue.nutritionalValueName?.group?.groupName || ""}
                                onChange={(e) =>
                                    handleNutritionalValueChange(index, 'nutritionalValueName', {
                                        ...nutritionalValue.nutritionalValueName, // Preserve existing properties
                                        group: {groupName: e.target.value} // Update only group property
                                    })
                                }
                                className="border rounded-lg p-3 w-full mb-2"
                            >
                                <option value="">Select Group Name</option>
                                {nutritionalValueGroups.map((group) => (
                                    <option key={group.groupName} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-1">Quantity:</label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={nutritionalValue.quantity || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'quantity', Number(e.target.value))}
                                className="border rounded-lg p-3 w-full mb-2"
                            />

                            <label className="block mb-1">Unit:</label>
                            <select
                                value={nutritionalValue.unit?.name || ""}
                                onChange={(e) =>
                                    handleNutritionalValueChange(index, 'unit', {name: e.target.value})
                                }
                                className="border rounded-lg p-3 w-full mb-2"
                            >
                                <option value="">Select Unit</option>
                                {unitOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>


                            <label className="block mb-1">NRV:</label>
                            <input
                                type="number"
                                placeholder="NRV"
                                value={nutritionalValue.nrv || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'nrv', Number(e.target.value))}
                                className="border rounded-lg p-3 w-full mb-2"
                            />
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleAddNutritionalValue}
                            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
                        >
                            Add Nutritional Value
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-center">
                        <button type="submit"
                                className="w-full max-w-xs bg-blue-500 text-white rounded-lg p-3 hover:bg-blue-600">Create
                            Product
                        </button>
                    </div>
                </div>

            </form>
        </>
    );
}
