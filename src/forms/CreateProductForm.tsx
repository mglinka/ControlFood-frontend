import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import {getAllPackageTypes, getAllUnits, getNutritionalValueGroups, getNutritionalValueNames} from "../api/api.ts";
import Select from "react-select";
import axiosInstance from "../api/axiosConfig.ts";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../utils/toastify.css'
import { z } from "zod";
import {FaBarcode, FaPlus} from "react-icons/fa";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

type UnitDTO = components["schemas"]["UnitDTO"];
type PackageTypeDTO = components["schemas"]["PackageTypeDTO"];
type NutritionalValueNameDTO = components["schemas"]["NutritionalValueNameDTO"];
type NutritionalValueGroupDTO = components["schemas"]["NutritionalValueGroupDTO"];
type CreateProductDTO = components["schemas"]["CreateProductDTO"];
type NutritionalValueDTO = components["schemas"]["NutritionalValueDTO"];

export function CreateProductForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [units, setUnits] = useState<UnitDTO[]>([]);
    const [packageTypes, setPackageTypes] = useState<PackageTypeDTO[]>([]);
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
        // ean: z.string().length(13, "EAN must be exactly 13 digits").regex(/^\d+$/, "EAN must contain only digits"),
        producerDTO: ProducerSchema,
        // productName: z.string().min(1, "Product name cannot be null").max(100, "Product name must be between 1 and 100 characters"),
        // productDescription: z.string().max(255, "Product description must be 255 characters or less").optional(),
        // productQuantity: z.number().min(0, "Product quantity must be zero or greater"),
        // unitDTO: z.object({
        //     name: z.string(),
        // }),
        // packageTypeDTO: z.object({
        //     name: z.string(),
        // }),
        // // country: z.string().nonempty("Country cannot be blank"),
        // labelDTO: z.object({
        //     storage: z.string().optional(),
        //     durability: z.string().optional(),
        //     instructionsAfterOpening: z.string().optional(),
        //     preparation: z.string().optional(),
        //     allergens: z.string().optional(),
        //     image: z.string().optional(),
        // }).optional(),
        // portionDTO: z.object({
        //     portionQuantity: z.number().optional(),
        //     unitDTO: z.object({
        //         name: z.string(),
        //     }),
        // })
        //     .optional(),
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
        compositionDTO: { ingredientDTOS: [{ name: "" }], additionDTOS: [{ name: "" }], flavourDTO: { name: "" } },
        nutritionalValueDTOS: [],
    });


    useEffect(() => {
        fetchUnits();
        fetchPackageTypes();
        fetchNutritionalValueNames();
        fetchNutritionalValueGroups();
        console.log("Start", packageTypes);
    }, []);



    const fetchUnits = async () => {
        try {
            const unitsData = await getAllUnits();
            setUnits(unitsData);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };

    const fetchPackageTypes = async () => {
        try {
            const packageTypesData = await getAllPackageTypes();
            setPackageTypes(packageTypesData);
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


    const handlePackageTypeChange = (selectedOption:any) => {
        if (selectedOption) {
            setCreateProduct((prev) => ({
                ...prev,
                packageTypeDTO: {
                    name: selectedOption.label,
                },
            }));
        }
    };
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
                ingredientDTOS: [
                    ...(prev.compositionDTO?.ingredientDTOS || []),
                    { name: "" }
                ],
            },
        }));
    };

    const handleAddAddition = () => {
        setCreateProduct((prev) => ({
            ...prev,
            compositionDTO: {
                ...prev.compositionDTO,
                additionDTOS: [
                    ...(prev.compositionDTO?.additionDTOS || []),  // Jeśli additionDTOS jest undefined, traktujemy to jako pustą tablicę
                    { name: "" }
                ],
            },
        }));
    };


    const handleNutritionalValueChange = (
        index: number,
        field: keyof NutritionalValueDTO,
        value: any
    ) => {
        setCreateProduct((prevProduct) => {
            const updatedNutritionalValues = [...(prevProduct.nutritionalValueDTOS || [])];

            if (!updatedNutritionalValues[index]) {
                updatedNutritionalValues[index] = {} as NutritionalValueDTO;
            }

            const updatedValue = { ...updatedNutritionalValues[index] };

            if (field === "nutritionalValueName" && typeof value === "object") {
                updatedValue.nutritionalValueName = {
                    ...(updatedValue.nutritionalValueName || {}),
                    ...value,
                };
            } else if (field === "quantity" || field === "nrv") {
                updatedValue[field] = value as number;
            } else if (field === "unit") {
                updatedValue.unit = { ...value };
            }

            updatedNutritionalValues[index] = updatedValue;

            return { ...prevProduct, nutritionalValueDTOS: updatedNutritionalValues };
        });
    };

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
        setLoading(true);

        try {
            CreateProductSchema.parse(createProduct);

            await axiosInstance.post('/products/add', createProduct);
            toast.success('Stworzenie produktu powiodło się');

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
                nutritionalValueDTOS: [],
            });

            setLoading(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const messages = error.errors.map((e) => e.message).join(", ");
                setLoading(false);
                toast.error(`Validation Error: ${messages}`);
            } else {
                console.error("Error creating product: ", error);
                setLoading(false);
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
                <h2 className="text-3xl font-bold text-center mb-6">Stwórz produkt</h2>

                <div className="mb-6">
                    <label className="block mb-1 text-sm font-semibold text-gray-600">Kod EAN:</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="ean"
                            value={createProduct.ean}
                            onChange={handleChange}
                            className="border-2 border-gray-500 rounded-lg p-3 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                            required
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                         <FaBarcode/>
                        </span>
                    </div>
                </div>


                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje o producencie</h3>
                    <label className="block mb-1">Nazwa producenta:</label>
                    <input
                        type="text"
                        name="producerDTO.name"
                        value={createProduct.producerDTO?.name}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Adres:</label>
                    <input
                        type="text"
                        name="producerDTO.address"
                        value={createProduct.producerDTO?.address}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Kod kraju:</label>
                    <input
                        type="number"
                        name="producerDTO.countryCode"
                        value={createProduct.producerDTO?.countryCode !== undefined ? createProduct.producerDTO.countryCode : ""}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                        required
                    />
                    <label className="block mb-1">Email:</label>
                    <input
                        type="text"
                        name="producerDTO.contact"
                        value={createProduct.producerDTO?.contact}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">NIP:</label>
                    <input
                        type="text"
                        name="producerDTO.nip"
                        value={createProduct.producerDTO?.nip}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">RMSD:</label>
                    <input
                        type="number"
                        name="producerDTO.rmsd"
                        value={createProduct.producerDTO?.rmsd}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Nazwa produktu:</label>
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
                    <label className="block mb-1 font-semibold">Opis produktu:</label>
                    <textarea
                        name="productDescription"
                        value={createProduct.productDescription}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Ilość produktu:</label>
                    <input
                        type="number"
                        name="productQuantity"
                        value={createProduct.productQuantity || ""}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Jednostka:</label>
                    <Select
                        options={unitOptions}
                        onChange={handleUnitChange}
                        placeholder="wybierz"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Opakowanie:</label>
                    <Select
                        options={packageTypes.map((type) => ({
                            label: type.name,
                        }))}
                        onChange={handlePackageTypeChange}
                        placeholder="wybierz"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Kraj:</label>
                    <input
                        type="text"
                        name="country"
                        value={createProduct.country}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje na etykiecie</h3>
                    <label className="block mb-1">Przechowywanie:</label>
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
                    <label className="block mb-1">Instrukcje po otworzeniu:</label>
                    <input
                        type="text"
                        name="labelDTO.instructionsAfterOpening"
                        value={createProduct.labelDTO?.instructionsAfterOpening}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Przygotowanie:</label>
                    <input
                        type="text"
                        name="labelDTO.preparation"
                        value={createProduct.labelDTO?.preparation}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Alergeny:</label>
                    <input
                        type="text"
                        name="labelDTO.allergens"
                        value={createProduct.labelDTO?.allergens}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />

                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje o porcji</h3>
                    <label className="block mb-1">Ilość porcji:</label>
                    <input
                        type="number"
                        name="portionDTO.portionQuantity"
                        value={createProduct.portionDTO?.portionQuantity || ""}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />
                    <label className="block mb-1">Jednostka porcji:</label>
                    <Select
                        options={unitOptions}
                        onChange={handleUnitChange}
                        placeholder="wybierz"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1">Składniki:</label>
                    {createProduct.compositionDTO?.ingredientDTOS?.map((ingredient, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="border rounded-lg p-3 w-full mr-2"
                                placeholder="nazwa składnika"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="button" onClick={handleAddIngredient}
                                className="bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600">
                            <FaPlus className="text-white text-2xl"/>
                        </button>
                    </div>
                </div>


                <div className="mb-6">
                    <label className="block mb-1">Dodatki:</label>
                    {createProduct.compositionDTO?.additionDTOS?.map((addition, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={addition.name}
                                onChange={(e) => handleAdditionChange(index, e.target.value)}
                                className="border rounded-lg p-3 w-full mr-2"
                                placeholder="nazwa dodatku"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddAddition}
                            className="bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600"
                        >
                            <FaPlus className="text-white text-2xl"/>
                        </button>
                    </div>
                </div>


                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Wartości odżywcze</h2>
                    {createProduct.nutritionalValueDTOS?.map((nutritionalValue, index) => (
                        <div key={index} className="nutritional-value-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1">Nazwa wartości odżywczej:</label>
                            <select
                                value={nutritionalValue.nutritionalValueName?.name || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'nutritionalValueName', {name: e.target.value})}
                                className="border rounded-lg p-3 w-full mb-2"
                            >
                                <option value="">wybierz</option>
                                {nutritionalValueNames.map((nv) => (
                                    <option key={nv.name} value={nv.name}>
                                        {nv.name}
                                    </option>
                                ))}
                            </select>


                            <label className="block mb-1">Nazwa grupy wartości odżywczej:</label>
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
                                <option value="">wybierz</option>
                                {nutritionalValueGroups.map((group) => (
                                    <option key={group.groupName} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-1">Ilość:</label>
                            <input
                                type="number"
                                placeholder="Ilość"
                                value={nutritionalValue.quantity || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'quantity', Number(e.target.value))}
                                className="border rounded-lg p-3 w-full mb-2"
                            />

                            <label className="block mb-1">Jednostka:</label>
                            <select
                                value={nutritionalValue.unit?.name || ""}
                                onChange={(e) =>
                                    handleNutritionalValueChange(index, 'unit', {name: e.target.value})
                                }
                                className="border rounded-lg p-3 w-full mb-2"
                            >
                                <option value="">wybierz</option>
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
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddNutritionalValue}
                            className="bg-orange-500 text-white rounded-lg p-2 hover:bg-orange-600"
                        >
                            <FaPlus className="text-white text-2xl"/>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-orange-500 text-white p-4 rounded-full flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <FiLoader className="animate-spin text-2xl"/>
                        ) : (
                            <FiCheckCircle className="text-2xl"/>
                        )}
                    </button>
                </div>


        </form>
</>
)
    ;
}
