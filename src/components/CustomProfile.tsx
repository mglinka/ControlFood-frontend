import React, {useEffect, useState} from "react";
import axiosInstance from "../api/axiosConfig";
import {authService} from "../utils/authService";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getAllAllergens} from "../api/api";
import {ArrowLeftIcon, XCircleIcon} from "@heroicons/react/16/solid";
import axios from "axios";
import {FaPen, FaPlus} from 'react-icons/fa';
import {FiCheckCircle} from "react-icons/fi";
import {components} from "../controlfood-backend-schema";
interface CustomProfileProps {onBack: () => void;}
type Allergy = components["schemas"]["GetAllergenDTO"];
type GetAllergenIntensityDTO = components["schemas"]["GetAllergenIntensityDTO"];





const CustomProfile: React.FC<CustomProfileProps> = ({ onBack }) => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<GetAllergenIntensityDTO[]>([]);
    const [initialSelectedAllergies, setInitialSelectedAllergies] = useState<GetAllergenIntensityDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const fetchAllergies = async () => {
        setLoading(true);
        try {
            const response = await getAllAllergens();
            const uniqueAllergies = response.filter(
                (allergy: Allergy, index: number, self: Allergy[]) =>
                    index === self.findIndex((a: Allergy) => a.allergen_id === allergy.allergen_id)
            );
            setAllergies(uniqueAllergies);
            console.log("Marta", uniqueAllergies);
        } catch (err) {
            setError("Error fetching allergens");
            console.log(error, loading);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllergyProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available.");
            }
            const response = await axiosInstance.get(`/allergy-profiles/byAccount/${accountId}`);
            console.log("jess", response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            console.error("Error fetching allergy profile:", error);
            throw error;
        }
    };

    const loadProfileData = async () => {
        await fetchAllergies();
        try {
            const allergyProfile = await fetchAllergyProfile();
            if (allergyProfile && allergyProfile.allergens) {
                const selected = allergyProfile.allergens.map((allergen: GetAllergenIntensityDTO) => ({
                    allergen_id: allergen.allergen_id || allergen.allergen_id,
                    name: allergen.name,
                    intensity: allergen.intensity,
                    type:allergen.type,



                }));

                console.log("Tutaj bęą", selected)
                console.log("Tutaj bęą", allergies)
                setSelectedAllergies(selected);
                setInitialSelectedAllergies(selected);
                setHasProfile(true);
                setAllergies((prevAllergies) =>
                    prevAllergies.filter(
                        (allergy) =>
                            !selected.some(
                                (selectedAllergy: GetAllergenIntensityDTO) => selectedAllergy.allergen_id === allergy.allergen_id
                            )
                    )
                );
            } else {
                setHasProfile(false);
                setSelectedAllergies([]);
            }
        } catch (error) {
            console.error("Failed to load allergy profile", error);
            setError("Failed to load allergy profile");
        }
    };

    useEffect(() => {
        loadProfileData();
        console.log("Nie wime", selectedAllergies)
    }, []);




    const handleAddAllergy = (allergy: Allergy, intensity: string) => {
        if (!allergy.name || !allergy.allergen_id) {
            console.error("Allergy name or allergen_id is undefined");
            return;
        }

        if (selectedAllergies.some((a) => a.allergen_id === allergy.allergen_id)) return;

        const allergenToAdd: GetAllergenIntensityDTO = {
            allergen_id: allergy.allergen_id,
            name: allergy.name,
            intensity,
            type: allergy.allergenType ?? "ALLERGEN",
        };


        setSelectedAllergies((prev) => [...prev, allergenToAdd]);

        setAllergies((prev) => prev.filter((a) => a.allergen_id !== allergy.allergen_id));

        if (!isCreating) {
            setIsCreating(true);
        }
    };


    const handleRemoveAllergy = (id: string) => {
        // Znajdź usunięty alergen w liście wybranych alergii
        const removedAllergy = selectedAllergies.find((allergy) => allergy.allergen_id === id);

        if (removedAllergy) {
            // Usuń alergen z listy wybranych
            setSelectedAllergies((prev) =>
                prev.filter((selected) => selected.allergen_id !== id)
            );

            // Dodaj alergen z powrotem do odpowiedniej kategorii
            setAllergies((prev) => [
                ...prev,
                {
                    allergen_id: removedAllergy.allergen_id,
                    name: removedAllergy.name,
                    allergenType: removedAllergy.type === "ALLERGEN" ? "ALLERGEN" : "INTOLERANT_INGREDIENT",
                },
            ]);
        }
    };





    const handleSaveProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available.");
            }

            const requestBody = {
                allergens: selectedAllergies.map(({ allergen_id, intensity }) => ({
                    allergen_id: allergen_id,
                    intensity,
                })),
            };

            if (hasProfile) {
                await axiosInstance.put(`/allergy-profiles/update/${accountId}`, requestBody);
            } else {
                await axiosInstance.post(`/allergy-profiles/create`, {
                    accountId: accountId,
                    allergens: requestBody.allergens,
                });
                setHasProfile(true);
            }

            toast.success("Edycja profilu powiodła się");
            setTimeout(async () => {
                await loadProfileData();
            }, 3000);
            setIsCreating(false);
            setIsEditing(false);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Error saving allergy profile");
        }
    };

    const handleCancelEdit = async () => {
        setSelectedAllergies(initialSelectedAllergies);
        await loadProfileData();
        setIsEditing(false);
        setIsCreating(false);
    };


    const intensityToBackgroundColor = (intensity: string) => {
        switch (intensity) {
            case "low":
                return "#ffd100";
            case "medium":
                return "#ea6f0d";
            case "high":
                return "#EF4444";
            default:
                return "#FFFFFF";
        }
    };

    const allergensByType = (allergies: Allergy[]) => {
        return allergies.reduce(
            (acc: { allergens: Allergy[]; intolerantIngredients: Allergy[] }, allergy: Allergy) => {
                if (allergy.allergenType === "ALLERGEN") {
                    acc.allergens.push(allergy);
                } else if (allergy.allergenType === "INTOLERANT_INGREDIENT") {
                    acc.intolerantIngredients.push(allergy);
                }
                return acc;
            },
            { allergens: [], intolerantIngredients: [] }
        );
    };

// Użyj dynamicznego podziału w renderowaniu:
    const { allergens: allergenList, intolerantIngredients: intolerantList } = allergensByType(allergies);


    const splitSelectedAllergiesByType = (allergies: GetAllergenIntensityDTO[]) => {
        const allergenList = allergies.filter(allergy => allergy.type === "ALLERGEN");
        const intolerantList = allergies.filter(allergy => allergy.type === "INTOLERANT_INGREDIENT");
        return { allergenList, intolerantList };
    };

    const {
        allergenList: selectedAllergenList,
        intolerantList: selectedIntolerantList } = splitSelectedAllergiesByType(selectedAllergies);





    return (
        <div className="w-full p-6 md:p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <div className="mt-4 mb-6 space-x-4 flex">
                {isEditing || isCreating ? (
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={handleCancelEdit}
                            className="bg-gray-300 text-gray-700 p-3 rounded-full hover:bg-gray-400 transform transition-transform duration-200 hover:scale-105"
                        >
                            <ArrowLeftIcon className="h-6 w-6"/>
                        </button>

                        <button
                            onClick={handleSaveProfile}
                            className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transform hover:scale-110 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
                        >
                            <FiCheckCircle className="text-white text-2xl"/>
                        </button>

                    </div>


                ) : hasProfile ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transform hover:scale-110 transition duration-300 ease-in-out"
                    >
                        <FaPen className="w-5 h-5 text-white" />
                    </button>

                ) : (
                    <>
                        <button
                            onClick={onBack}
                            className="ml-4 bg-gray-300 text-gray-700 p-3 rounded-full hover:bg-gray-400"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
                        >
                            <FaPlus className="text-white text-2xl" />
                        </button>
                    </>

                )}
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
                {/* Allergens section */}
                <div className="md:w-1/2 w-full mb-6 md:mb-0">
                    <h2 className="text-2xl font-semibold text-black mb-4 text-center">Alergeny</h2>
                    {/* Allergen type categories */}
                    <h3 className="text-xl font-semibold  mt-2 mb-6">Alergeny</h3>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {allergenList.map((allergy) => (
                            <div key={allergy.allergen_id}
                                 className="bg-white p-4 px-6 rounded-full shadow-lg text-center border border-gray-300">
                                <span className="font-semibold text-lg">{allergy.name}</span>
                                {(isEditing || isCreating) && (
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleAddAllergy(allergy, "low")}
                                                className="w-8 h-8 rounded-full bg-yellow-500"></button>
                                        <button onClick={() => handleAddAllergy(allergy, "medium")}
                                                className="w-8 h-8 rounded-full bg-orange-500"></button>
                                        <button onClick={() => handleAddAllergy(allergy, "high")}
                                                className="w-8 h-8 rounded-full bg-red-500"></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-12">Składniki nietolerowane</h3>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {intolerantList.map((allergy) => (
                            <div key={allergy.allergen_id}
                                 className="bg-white p-4 px-6 rounded-full shadow-lg text-center border border-gray-300">
                                <span className="font-semibold text-lg">{allergy.name}</span>
                                {(isEditing || isCreating) && (
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleAddAllergy(allergy, "low")}
                                                className="w-8 h-8 rounded-full bg-yellow-500"></button>
                                        <button onClick={() => handleAddAllergy(allergy, "medium")}
                                                className="w-8 h-8 rounded-full bg-orange-500"></button>
                                        <button onClick={() => handleAddAllergy(allergy, "high")}
                                                className="w-8 h-8 rounded-full bg-red-500"></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                <div className="md:w-1/2 w-full">
                    <h2 className="text-2xl font-semibold text-black mb-4 text-center">Wybrane alergeny</h2>

                    {/* Sekcja Alergeny */}
                    <h3 className="text-xl font-semibold mt-2 mb-6">Alergeny</h3>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {selectedAllergenList.map(({ allergen_id, name, intensity }) => (
                            <div key={allergen_id}
                                 className="p-4 px-6 rounded-full shadow-lg text-center flex items-center justify-center"
                                 style={{ backgroundColor: intensityToBackgroundColor(intensity as string) }}>
                                <span className="font-semibold text-lg text-white">{name}</span>
                                {(isEditing || isCreating) && (
                                    <button onClick={() => handleRemoveAllergy(allergen_id as string)}
                                            className="text-black hover:text-gray-800 ml-2">
                                        <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sekcja Składniki nietolerowane */}
                    <h3 className="text-xl font-semibold mb-6 mt-12">Składniki nietolerowane</h3>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {selectedIntolerantList.map(({ allergen_id, name, intensity }) => (
                            <div key={allergen_id}
                                 className="p-4 px-6 rounded-full shadow-lg text-center flex items-center justify-center"
                                 style={{ backgroundColor: intensityToBackgroundColor(intensity as string) }}>
                                <span className="font-semibold text-lg text-white">{name}</span>
                                {(isEditing || isCreating) && (
                                    <button onClick={() => handleRemoveAllergy(allergen_id as string)}
                                            className="text-black hover:text-gray-800 ml-2">
                                        <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>



            </div>


            {saveError && <p className="text-red-500 mt-4">{saveError}</p>}

            <ToastContainer/>
        </div>
    );


};

export default CustomProfile;
