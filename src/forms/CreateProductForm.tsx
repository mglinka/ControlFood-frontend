import React, { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import {
    getAllPackageTypes,
    getAllUnits,
    getCategories,
    getNutritionalValueGroups,
    getNutritionalValueNames
} from "../api/api.ts";
import Select from "react-select";
import axiosInstance from "../api/axiosConfig.ts";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../utils/toastify.css'
import {z, ZodError} from "zod";
import {FaBarcode, FaPlus} from "react-icons/fa";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

type UnitDTO = components["schemas"]["UnitDTO"];
type PackageTypeDTO = components["schemas"]["PackageTypeDTO"];
type CategoryDTO = components["schemas"]["GetCategoryDTO"];
type NutritionalValueNameDTO = components["schemas"]["NutritionalValueNameDTO"];
type NutritionalValueGroupDTO = components["schemas"]["NutritionalValueGroupDTO"];
type CreateProductDTO = components["schemas"]["CreateProductDTO"];
type NutritionalValueDTO = components["schemas"]["NutritionalValueDTO"];
interface ValidationErrors {
    ean?: string;
    productName?: string;
    productDescription?: string;
    productQuantity?: string;
    country?: string;
    labelDTO?: {
        storage?: string;
        durability?: string;
        instructionsAfterOpening?: string;
        preparation?: string;
        allergens?: string;
    };
    producerDTO?: {
        name?: string;
        address?: string;
        countryCode?: string;
        contact?: string;
        nip?: string;
        rmsd?: string;
    };
    portionDTO?: string;
    ingredientDTO?: string;
    name?: string; // For the ingredient name field
}

type SelectOption = {
    label: string;
    value: string;
};

type PackageOption = {
    label: string;
    value: string;
};


export function CreateProductForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [units, setUnits] = useState<UnitDTO[]>([]);
    const [packageTypes, setPackageTypes] = useState<PackageTypeDTO[]>([]);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [nutritionalValueNames, setNutritionalValueNames] = useState<NutritionalValueNameDTO[]>([]);
    const [nutritionalValueGroups, setNutritionalValueGroups] = useState<NutritionalValueGroupDTO[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const [selectedPackageType, setSelectedPackageType] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedPortionUnit, setSelectedPortionUnit] = useState(null);


    const ProducerSchema = z.object({
        name: z.string().min(2, "Producer name cannot be blank").max(100, "Producer name must be 100 characters or less"),
        address: z.string().min(2, "Address cannot be blank").max(255, "Address must be 255 characters or less"),
        countryCode: z.number().min(1, "Country code must be a positive integer").max(999, "Country code must be a valid ISO country code (1-999)"),
        contact: z.string().email("Contact must be a valid email format"),
        nip: z.string().length(10, "NIP must be exactly 10 digits"),
        rmsd: z.number().min(0).max(3),
    });

    const LabelSchema = z.object({
        storage: z.string().max(255, "Przechowywnie").optional(),
        durability: z.string().max(255, "Trwałość nie może przekraczać 255 znaków").optional(),
        instructionsAfterOpening: z.string().max(255, "Instrukcje po otwarciu nie mogą przekraczać 255 znaków").optional(),
        preparation: z.string().max(255, "Przygotowanie nie może przekraczać 255 znaków").optional(),
        allergens: z.string().max(255, "Alergeny nie mogą przekraczać 255 znaków").optional(),
    });
    const IngredientSchema = z.object({
        name: z.string().min(2, "Ingredient name cannot be blank").max(100, "Ingredient name must be 100 characters or less").optional(),
    });

    const CreateProductSchema = z.object({
        ean: z.string().length(13, "Kod EAN musi mieć dokładnie 13 cyfr").regex(/^\d+$/, "Kod EAN musi zawierać tylko cyfry"),
        producerDTO: ProducerSchema,
        productName: z.string().min(1, "Nazwa produktu nie może być pusta").max(100, "Nazwa produktu musi mieć od 1 do 100 znaków"),
        productDescription: z.string().max(255, "Opis produktu nie może przekraczać 255 znaków").optional(),
        productQuantity: z.number().min(1, "Ilość produktu musi wynosić co najmniej 1").optional(),
        country: z.string().nonempty("Kraj nie może być pusty").optional(),
        labelDTO: LabelSchema.optional(),
        portionDTO: z.object({
            portionQuantity: z.number(),
        }),
        // category: z.object({
        //     name: z.string().nonempty("Nazwa kategorii nie może być pusta"), // Dodatkowa walidacja, jeśli jest dostępna
        // }),
        ingredientDTO: IngredientSchema.optional(),
    });


    const [createProduct, setCreateProduct] = useState<CreateProductDTO>({
        ean: "",
        producerDTO: { name: "", address: "", countryCode: 0, contact: "", nip: "", rmsd: 1 },
        productName: "",
        category: {id:"", name:""},
        productDescription: "",
        productQuantity: 0,
        unitDTO: { name: "" },
        packageTypeDTO: { name: "" },
        country: "",
        labelDTO: { storage: "", durability: "", instructionsAfterOpening: "", preparation: "", allergens: "", image: "" },
        portionDTO: { portionQuantity: 0, unitDTO: { name: "" } },
        compositionDTO: { ingredientDTOS: [{ name: "" }], additionDTOS: [{ name: "" }], flavourDTO: { name: "" } },
        nutritionalValueDTOS: [],
    });


    useEffect(() => {
        fetchUnits();
        fetchCategories();
        fetchPackageTypes();
        fetchNutritionalValueNames();
        fetchNutritionalValueGroups();
    }, []);



    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };

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
        if (name === 'ean') {
            try {
                CreateProductSchema.pick({ean: true}).parse({ean: value}); // Validate email only
                setValidationErrors(prev => ({...prev, ean: undefined}));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Get the first validation message
                    setValidationErrors(prev => ({...prev, ean: message}));
                }
            }
        }
        else if (name === 'producerDTO.name') {
            try {
                ProducerSchema.pick({ name: true }).parse({ name: value });

                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        name: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            name: message, // Ustaw komunikat błędu dla 'name'
                        }
                    }));
                }
            }
        }
        else if (name === 'producerDTO.address') {
            try {
                // Używamy ProducerSchema do walidacji tylko pola 'address'
                ProducerSchema.pick({ address: true }).parse({ address: value });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        address: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            address: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'producerDTO.countryCode') {
            try {
                // Konwertujemy wartość na liczbę
                const numericValue = Number(value);

                // Używamy ProducerSchema do walidacji pola 'countryCode'
                ProducerSchema.pick({ countryCode: true }).parse({ countryCode: numericValue });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        countryCode: '', // Brak błędu
                    },
                }));

                // Aktualizacja stanu createProduct
                setCreateProduct((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        countryCode: numericValue, // Ustawiona wartość liczby
                    },
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            countryCode: message, // Ustaw komunikat błędu dla 'countryCode'
                        },
                    }));
                }
            }
        }

        else if (name === 'producerDTO.contact') {
            try {
                // Używamy ProducerSchema do walidacji tylko pola 'address'
                ProducerSchema.pick({ contact: true }).parse({ contact: value });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        contact: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            contact: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'producerDTO.nip') {
            try {
                // Używamy ProducerSchema do walidacji tylko pola 'address'
                ProducerSchema.pick({ nip: true }).parse({ nip: value });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        nip: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            nip: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'producerDTO.rmsd') {
            try {
                // Konwertujemy wartość na liczbę
                const numericValue = Number(value);

                // Używamy ProducerSchema do walidacji pola 'rmsd'
                ProducerSchema.pick({ rmsd: true }).parse({ rmsd: numericValue });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        rmsd: '', // Brak błędu
                    },
                }));

                // Aktualizacja stanu createProduct
                setCreateProduct((prev) => ({
                    ...prev,
                    producerDTO: {
                        ...prev.producerDTO,
                        rmsd: numericValue, // Ustawiona wartość liczby
                    },
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        producerDTO: {
                            ...prev.producerDTO,
                            rmsd: message, // Ustaw komunikat błędu dla 'rmsd'
                        },
                    }));
                }
            }
        }

        else if (name === 'productName') {
            try {
                // Walidacja z użyciem schematu
                CreateProductSchema.pick({ productName: true }).parse({ productName: value });

                // Jeśli walidacja przejdzie, usuwamy błąd dla pola productName
                setValidationErrors((prev) => ({
                    ...prev,
                    productName: undefined, // Brak błędu
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    // Pobranie komunikatu błędu
                    const message = error.errors[0].message;
                    setValidationErrors((prev) => ({
                        ...prev,
                        productName: message, // Ustawienie błędu dla pola productName
                    }));
                }
            }
        }

        else if (name === 'productDescription') {
            try {
                const parsedValue = value === '' ? undefined : value;

                CreateProductSchema.pick({ productDescription: true }).parse({ productDescription: parsedValue });

                setValidationErrors((prev) => ({ ...prev, productDescription: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message;
                    setValidationErrors((prev) => ({ ...prev, productDescription: message }));
                }
            }
        }

        else if (name === 'productQuantity') {
            try {
                // Konwersja wartości na liczbę
                const parsedValue = Number(value);

                // Walidacja
                CreateProductSchema.pick({ productQuantity: true }).parse({ productQuantity: parsedValue });

                // Jeśli walidacja się powiedzie, usuwamy błąd
                setValidationErrors((prev) => ({ ...prev, productQuantity: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobranie komunikatu błędu
                    setValidationErrors((prev) => ({ ...prev, productQuantity: message }));
                }
            }
        }
        else if (name === 'country') {
            try {
                // Walidacja pola 'country'
                CreateProductSchema.pick({ country: true }).parse({ country: value });

                // Jeśli walidacja się powiedzie, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({ ...prev, country: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobranie komunikatu błędu
                    setValidationErrors((prev) => ({ ...prev, country: message }));
                }
            }
        }
        else if (name === 'labelDTO.storage') {
            try {
                // Używamy ProducerSchema do walidacji tylko pola 'address'
                LabelSchema.pick({ storage: true }).parse({ storage: value });

                // Jeśli walidacja przeszła, usuwamy ewentualny błąd
                setValidationErrors((prev) => ({
                    ...prev,
                    labelDTO: {
                        ...prev.labelDTO,
                        storage: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        labelDTO: {
                            ...prev.labelDTO,
                            storage: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'labelDTO.durability') {
            try {
                LabelSchema.pick({ durability: true }).parse({ durability: value });

                setValidationErrors((prev) => ({
                    ...prev,
                    labelDTO: {
                        ...prev.labelDTO,
                        durability: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        labelDTO: {
                            ...prev.labelDTO,
                            durability: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'labelDTO.instructionsAfterOpening') {
            try {
                LabelSchema.pick({ instructionsAfterOpening: true }).parse({ instructionsAfterOpening: value });

                setValidationErrors((prev) => ({
                    ...prev,
                    labelDTO: {
                        ...prev.labelDTO,
                        instructionsAfterOpening: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        labelDTO: {
                            ...prev.labelDTO,
                            instructionsAfterOpening: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'labelDTO.preparation') {
            try {
                LabelSchema.pick({ preparation: true }).parse({ preparation: value });

                setValidationErrors((prev) => ({
                    ...prev,
                    labelDTO: {
                        ...prev.labelDTO,
                        preparation: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        labelDTO: {
                            ...prev.labelDTO,
                            preparation: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }else if (name === 'labelDTO.allergens') {
            try {
                LabelSchema.pick({ allergens: true }).parse({ allergens: value });

                setValidationErrors((prev) => ({
                    ...prev,
                    labelDTO: {
                        ...prev.labelDTO,
                        preparation: '', // Brak błędu
                    }
                }));
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.errors[0].message; // Pobierz komunikat błędu
                    setValidationErrors((prev) => ({
                        ...prev,
                        labelDTO: {
                            ...prev.labelDTO,
                            allergens: message, // Ustaw komunikat błędu dla 'address'
                        }
                    }));
                }
            }
        }
        else if (name === 'name') {
            try {
                // Walidacja pola "name"
                IngredientSchema.pick({ name: true }).parse({ name: value });

                // Usunięcie błędu, jeśli walidacja przeszła
                setValidationErrors(prev => ({ ...prev, name: undefined }));
            } catch (error) {
                if (error instanceof ZodError) {
                    // Pobranie komunikatu o błędzie
                    const message = error.errors[0].message;

                    // Ustawienie błędu dla pola "name"
                    setValidationErrors(prev => ({ ...prev, name: message }));
                }
            }
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
        setLoading(true); // Start loading

        try {
            CreateProductSchema.parse(createProduct);

            console.log("ggg", selectedPackageType, createProduct.packageTypeDTO.name)
            await axiosInstance.post('/products/add', createProduct);
            alert("dodany")
            console.log("Dodany", createProduct)
            toast.success('Stworzenie produktu powiodło się');

            setCreateProduct(prevState => ({
                ...prevState,
                ean: "",
                producerDTO: { name: "", address: "", countryCode: 0, contact: "", nip: "", rmsd: 0 },
                productName: "",
                productDescription: "",
                productQuantity: undefined,
                country: "",
                labelDTO: { storage: "", durability: "", instructionsAfterOpening: "", preparation: "", allergens: "", image: "" },
                portionDTO: { portionQuantity: undefined, unitDTO: { name: "" } },
                compositionDTO: { ingredientDTOS: [], additionDTOS: [], flavourDTO: { name: "" } },
                nutritionalValueDTOS: [],
                category: { name: "" }, // Resetowanie kategorii
                unitDTO: { name: "" }, // Resetowanie jednostki
                packageTypeDTO: { name: "" }, // Resetowanie opakowania
            }));

            setSelectedPackageType(null);
            setSelectedCategory(null);
            setSelectedUnit(null);
            setSelectedPortionUnit(null);


            setLoading(false); // Stop loading on success
        } catch (error) {
            setLoading(false); // Always stop loading on error

            if (error instanceof z.ZodError) {
                // Zbieranie błędów walidacji i przypisywanie komunikatów do odpowiednich pól
                const validationErrors = error.errors.reduce((acc: Record<string, string>, curr) => {
                    const field = curr.path[0]; // Zwróci nazwę pola, np. 'ean', 'productName', etc.
                    const errorMessage = curr.message;
                    acc[field] = errorMessage; // Dodajemy błąd do odpowiedniego pola
                    return acc;
                }, {} as Record<string, string>); // Explicitly typing acc as Record<string, string>

                // Ustawienie stanu z błędami
                setValidationErrors(validationErrors);

                if (selectedCategory == null) {
                    toast.error("Wypełnij kategorię produktu")
                }
                else if (selectedPackageType==null){
                    toast.error("Wypełnij typ opakowania")
                }
                else if (selectedUnit==null){
                    toast.error("Wypełnij jednostkę")
                }
                else if (selectedPortionUnit==null) {
                    toast.error("Wypełnij jednostkę porcji")
                }

                else {

                console.log("TTT", createProduct, error, selectedCategory)
                // Wyświetlanie ogólnego komunikatu o błędzie
                toast.error("Wypełnij poprawnie wszystkie pola w formularzu");
            }
            } else {
                console.error("Error creating product: ", error);
                if (axios.isAxiosError(error) && error.response) {
                    const statusCode = error.response.status;
                    const errorMessage = error.response.data?.message || "An error occurred";
                    toast.error(`Error ${statusCode}: ${errorMessage}`);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        }
    };


    const handlePackageTypeChange = (selectedOption: { label: string; value: string } | null) => {
        setSelectedPackageType(selectedOption ? selectedOption.value : null);

        console.log("Handle", selectedPackageType)
        // Aktualizuj również `createProduct`
        setCreateProduct((prevState) => ({
            ...prevState,
            packageTypeDTO: {
                name: selectedOption ? selectedOption.label : "", // Zapisz nazwę pakietu
            },
        }));
        console.log("aa", createProduct)
    };


    const handleCategoryChange = (selectedOption: any) => {
        const categoryId = selectedOption ? selectedOption.value : null;
        const categoryName = selectedOption ? selectedOption.label : "";

        setSelectedCategory(categoryId); // Aktualizuj stan lokalny
        setCreateProduct((prev) => ({
            ...prev,
            category: { id: categoryId, name: categoryName }, // Ustaw odpowiednie pola w obiekcie
        }));
    };

    const handleUnitChange = (selectedOption: any) => {
        const unitName = selectedOption ? selectedOption.value : null;

        setSelectedUnit(unitName); // Aktualizuj stan lokalny
        setCreateProduct((prev) => ({
            ...prev,
            unitDTO: { name: unitName }, // Aktualizuj obiekt
        }));
    };

    const handlePortionUnitChange = (selectedOption: any) => {
        const portionUnitName = selectedOption ? selectedOption.value : null;

        setSelectedPortionUnit(portionUnitName); // Aktualizuj stan lokalny
        setCreateProduct((prev) => ({
            ...prev,
            portionDTO: {
                ...prev.portionDTO,
                unitDTO: { name: portionUnitName }, // Aktualizuj jednostkę porcji w obiekcie
            },
        }));
    };

    const handlePackageTypes = (packageTypes: any[]): PackageOption[] => {
        return packageTypes.map((type) => ({
            label: type.name || "Unknown",  // Jeśli name jest undefined, ustawiamy "Unknown"
            value: type.name || "",         // Jeśli name jest undefined, ustawiamy ""
        }));
    };






    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-8">
                <h2 className="text-3xl font-bold text-center mb-6">Stwórz produkt</h2>

                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Kod EAN
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="ean"
                            value={createProduct.ean}
                            onChange={handleChange}
                            className={`border-2 rounded-full p-3 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10 
                ${validationErrors.ean ? 'border-red-500' : 'border-gray-500'}`}
                            required
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaBarcode/>
        </span>
                    </div>
                    {validationErrors.ean && (
                        <p className="text-red-500 text-sm">{validationErrors.ean}</p>
                    )}
                </div>


                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Nazwa produktu
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                    </label>
                    <input
                        type="text"
                        name="productName"
                        value={createProduct.productName}
                        onChange={handleChange}
                        className={`border rounded-full p-3 w-full ${validationErrors.productName ? 'border-red-500' : ''}`}
                        required
                    />
                    {validationErrors.productName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.productName}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Kategoria
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}
                    </label>
                    <Select<SelectOption>
                        options={categories.map((category) => ({
                            label: category.name || "Unknown", // Wyświetlaj nazwę kategorii
                            value: category.id || "",         // Przechowuj id jako wartość
                        }))}
                        value={selectedCategory
                            ? {
                                label: categories.find((category) => category.id === selectedCategory)?.name || "Unknown",
                                value: selectedCategory,
                            }
                            : null} // Jeśli selectedCategory jest null, Select będzie pusty
                        onChange={handleCategoryChange}
                        placeholder="wybierz"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />

                </div>


                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Opis produktu

                    </label>
                    <textarea
                        name="productDescription"
                        value={createProduct.productDescription}
                        onChange={handleChange}
                        className={`border rounded-full p-3 w-full ${validationErrors.productDescription ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.productDescription && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.productDescription}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Liczba produktów
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                    </label>
                    <input
                        type="number"
                        name="productQuantity"
                        value={createProduct.productQuantity || ""}
                        onChange={handleChange}
                        className={`border rounded-full p-3 w-full ${validationErrors.productQuantity ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.productQuantity && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.productQuantity}</p>
                    )}
                </div>


                <div className="mb-6 rounded-full">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Jednostka
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}
                    </label>
                    <Select
                        options={unitOptions}
                        value={unitOptions.find((option) => option.value === selectedUnit) || null} // Znajdź obiekt na podstawie value (id)
                        onChange={handleUnitChange}
                        placeholder="wybierz"
                        className="rounded-full" // Zaokrąglony kontener
                    />

                </div>


                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Opakowanie
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}
                    </label>
                    <Select<PackageOption>
                        options={handlePackageTypes(packageTypes)}  // Przetworzenie danych
                        value={selectedPackageType
                            ? { label: selectedPackageType, value: selectedPackageType }
                            : null}
                        onChange={handlePackageTypeChange}
                        placeholder="wybierz"
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />



                </div>


                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Kraj
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                    </label>
                    <input
                        type="text"
                        name="country"
                        value={createProduct.country || ""}
                        onChange={handleChange}
                        className={`border rounded-full p-3 w-full ${validationErrors.country ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.country && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje o producencie</h3>
                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Nazwa producenta
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="text"
                            name="producerDTO.name"
                            value={createProduct.producerDTO?.name}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full 
            ${validationErrors?.producerDTO?.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors?.producerDTO?.name && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.name}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Adres:
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="text"
                            name="producerDTO.address"
                            value={createProduct.producerDTO?.address}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full 
                                ${validationErrors?.producerDTO?.address ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors?.producerDTO?.address && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.address}</p>
                        )}
                    </div>


                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Kod kraju
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="number"
                            name="producerDTO.countryCode"
                            value={createProduct.producerDTO?.countryCode !== undefined ? createProduct.producerDTO.countryCode : ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors?.producerDTO?.countryCode ? 'border-red-500' : ''}`}
                        />
                        {validationErrors?.producerDTO?.countryCode && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.countryCode}</p>
                        )}
                    </div>


                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Email
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="text"
                            name="producerDTO.contact"
                            value={createProduct.producerDTO?.contact}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors?.producerDTO?.contact ? 'border-red-500' : ''}`}
                        />
                        {validationErrors?.producerDTO?.contact && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.contact}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            NIP
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="text"
                            name="producerDTO.nip"
                            value={createProduct.producerDTO?.nip}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full 
            ${validationErrors?.producerDTO?.nip ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors?.producerDTO?.nip && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.nip}</p>
                        )}
                    </div>


                    <div className="mb-6">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            RMSD
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                        </label>
                        <input
                            type="number"
                            name="productQuantity"
                            min="1"
                            max="3"
                            step="1"
                            value={createProduct.productQuantity || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors?.producerDTO?.rmsd ? 'border-red-500' : ''}`}
                        />
                        {validationErrors?.producerDTO?.rmsd && (
                            <p className="text-red-500 text-sm">{validationErrors.producerDTO.rmsd}</p>
                        )}
                    </div>


                </div>


                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje na etykiecie</h3>
                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Przechowywanie

                        </label>
                        <input
                            type="text"
                            name="labelDTO.storage"
                            value={createProduct.labelDTO?.storage || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors.labelDTO?.storage ? "border-red-500" : ""}`}
                        />
                        {validationErrors.labelDTO?.storage && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.labelDTO.storage}</p>
                        )}
                    </div>

                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Data przydatności

                        </label>
                        <input
                            type="text"
                            name="labelDTO.durability"
                            value={createProduct.labelDTO?.durability || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors.labelDTO?.durability ? "border-red-500" : ""}`}
                        />
                        {validationErrors.labelDTO?.durability && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.labelDTO.durability}</p>
                        )}
                    </div>

                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Instrukcje po otworzeniu

                        </label>
                        <input
                            type="text"
                            name="labelDTO.instructionsAfterOpening"
                            value={createProduct.labelDTO?.instructionsAfterOpening || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors.labelDTO?.instructionsAfterOpening ? "border-red-500" : ""}`}
                        />
                        {validationErrors.labelDTO?.instructionsAfterOpening && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.labelDTO.instructionsAfterOpening}</p>
                        )}
                    </div>

                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Przygotowanie

                        </label>
                        <input
                            type="text"
                            name="labelDTO.preparation"
                            value={createProduct.labelDTO?.preparation || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors.labelDTO?.preparation ? "border-red-500" : ""}`}
                        />
                        {validationErrors.labelDTO?.preparation && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.labelDTO.preparation}</p>
                        )}
                    </div>

                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Alergeny

                        </label>
                        <input
                            type="text"
                            name="labelDTO.allergens"
                            value={createProduct.labelDTO?.allergens || ""}
                            onChange={handleChange}
                            className={`border rounded-full p-3 w-full ${validationErrors.labelDTO?.allergens ? "border-red-500" : ""}`}
                        />
                        {validationErrors.labelDTO?.allergens && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.labelDTO.allergens}</p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3">Informacje o porcji</h3>
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Liczba porcji
                        <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}

                    </label>
                    <input
                        type="number"
                        name="portionDTO.portionQuantity"
                        value={createProduct.portionDTO?.portionQuantity || ""}
                        onChange={handleChange}
                        className="border rounded-full p-3 w-full"
                    />
                    <div className="my-4">
                        <label className="block mb-1 text-xl font-semibold text-gray-600">
                            Jednostka porcji
                            <span className="text-red-500 ml-1 text-2xl">*</span> {/* Ikona gwiazdki powiększona */}
                        </label>
                        <Select
                            options={unitOptions}
                            value={unitOptions.find((option) => option.value === selectedPortionUnit) || null} // Znajdź obiekt na podstawie value (id)
                            onChange={handlePortionUnitChange} // Obsługuje zmianę jednostki porcji
                            placeholder="wybierz"
                            className="rounded-full" // Zaokrąglony kontener
                        />

                    </div>

                </div>
                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Składniki

                    </label>
                    {createProduct.compositionDTO?.ingredientDTOS?.map((ingredient, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                className="border rounded-full p-3 w-full mr-2"
                                placeholder="nazwa składnika"
                            />

                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button type="button" onClick={handleAddIngredient}
                                className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600">
                            <FaPlus className="text-white text-2xl"/>
                        </button>
                    </div>
                </div>


                <div className="mb-6">
                    <label className="block mb-1 text-xl font-semibold text-gray-600">
                        Dodatki

                    </label>
                    {createProduct.compositionDTO?.additionDTOS?.map((addition, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={addition.name}
                                onChange={(e) => handleAdditionChange(index, e.target.value)}
                                className="border rounded-full p-3 w-full mr-2"
                                placeholder="nazwa dodatku"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddAddition}
                            className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600"
                        >
                            <FaPlus className="text-white text-2xl"/>
                        </button>
                    </div>
                </div>


                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Wartości odżywcze</h2>
                    {createProduct.nutritionalValueDTOS?.map((nutritionalValue, index) => (
                        <div key={index} className="nutritional-value-input border rounded-lg p-4 mb-4">
                            <label className="block mb-1 text-xl font-semibold text-gray-600">
                                Nazwa wartości odżywczej

                            </label>
                            <select
                                value={nutritionalValue.nutritionalValueName?.name || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'nutritionalValueName', {name: e.target.value})}
                                className="border rounded-full p-3 w-full mb-2"
                            >
                                <option value="">wybierz</option>
                                {nutritionalValueNames.map((nv) => (
                                    <option key={nv.name} value={nv.name}>
                                        {nv.name}
                                    </option>
                                ))}
                            </select>


                            <label className="block mb-1 text-xl font-semibold text-gray-600">
                                Nazwa grupy wartości odżywczej

                            </label>

                            <select
                                value={nutritionalValue.nutritionalValueName?.group?.groupName || ""}
                                onChange={(e) =>
                                    handleNutritionalValueChange(index, 'nutritionalValueName', {
                                        ...nutritionalValue.nutritionalValueName, // Preserve existing properties
                                        group: {groupName: e.target.value} // Update only group property
                                    })
                                }
                                className="border rounded-full p-3 w-full mb-2"
                            >
                                <option value="">wybierz</option>
                                {nutritionalValueGroups.map((group) => (
                                    <option key={group.groupName} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-1 text-xl font-semibold text-gray-600">
                                Ilość

                            </label>
                            <input
                                type="number"
                                placeholder="Ilość"
                                value={nutritionalValue.quantity || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'quantity', Number(e.target.value))}
                                className="border rounded-full p-3 w-full mb-2"
                            />

                            <label className="block mb-1 text-xl font-semibold text-gray-600">
                                Jednostka

                            </label>
                            <select
                                value={nutritionalValue.unit?.name || ""}
                                onChange={(e) =>
                                    handleNutritionalValueChange(index, 'unit', {name: e.target.value})
                                }
                                className="border rounded-full p-3 w-full mb-2"
                            >
                                <option value="">wybierz</option>
                                {unitOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>


                            <label className="block mb-1 text-xl font-semibold text-gray-600">
                                NRV

                            </label>
                            <input
                                type="number"
                                placeholder="NRV"
                                value={nutritionalValue.nrv || ""}
                                onChange={(e) => handleNutritionalValueChange(index, 'nrv', Number(e.target.value))}
                                className="border rounded-full p-3 w-full mb-2"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddNutritionalValue}
                            className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600"
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
