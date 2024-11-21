import React, { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosConfig";
import { authService } from '../utils/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllAllergens } from "../api/api.ts";
import axios from "axios";
import {XCircleIcon} from "@heroicons/react/16/solid";


interface Allergy {
    allergen_id: string;
    name: string;
}

interface SelectedAllergy {
    allergenId: string;
    name: string;
    intensity: string;
}

const AllergyProfilePage: React.FC = () => {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [selectedAllergies, setSelectedAllergies] = useState<SelectedAllergy[]>([]);
    const [initialSelectedAllergies, setInitialSelectedAllergies] = useState<SelectedAllergy[]>([]);
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
        } catch (err) {
            setError('Error fetching allergens');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllergyProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }

            const response = await axiosInstance.get(`/allergy-profiles/byAccount/${accountId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null; // No profile found
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
                const selected = allergyProfile.allergens.map((allergen: any) => ({
                    allergenId: allergen.allergenId || allergen.allergen_id,
                    name: allergen.name,
                    intensity: allergen.intensity,
                }));

                setSelectedAllergies(selected);
                setInitialSelectedAllergies(selected);
                setHasProfile(true);
                setAllergies((prevAllergies) =>
                    prevAllergies.filter(allergy =>
                        !selected.some((selectedAllergy: SelectedAllergy) => selectedAllergy.allergenId === allergy.allergen_id)
                    )
                );
            } else {
                setHasProfile(false);
                setSelectedAllergies([]);
            }
        } catch (error) {
            console.error('Failed to load allergy profile', error);
            setError('Failed to load allergy profile');
        }
    };

    useEffect(() => {
        loadProfileData();
    }, []);

    const handleRefresh = async () => {
        await loadProfileData();
    };

    const handleAddAllergy = (allergy: Allergy, intensity: string) => {
        if (selectedAllergies.some((a) => a.allergenId === allergy.allergen_id)) return;

        const allergenToAdd: SelectedAllergy = { allergenId: allergy.allergen_id, name: allergy.name, intensity };
        setSelectedAllergies((prev) => [...prev, allergenToAdd]);
        setAllergies((prev) => prev.filter((a) => a.allergen_id !== allergy.allergen_id));

        if (!isCreating) {
            setIsCreating(true);
        }
    };

    const handleRemoveAllergy = (id: string) => {
        const removedAllergy = selectedAllergies.find((allergy) => allergy.allergenId === id);
        if (removedAllergy) {
            setSelectedAllergies((prev) => prev.filter((selected) => selected.allergenId !== id));
            setAllergies((prev) => [...prev, { allergen_id: removedAllergy.allergenId, name: removedAllergy.name }]);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const accountId = authService.getAccountId();
            if (!accountId) {
                throw new Error("Account ID is not available. User might not be logged in.");
            }

            const requestBody = {
                allergens: selectedAllergies.map(({ allergenId, intensity }) => ({
                    allergen_id: allergenId,
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

            toast.success('Allergy profile updated successfully!');
            setTimeout(async () => {
                await handleRefresh();
            }, 3000);
            setIsCreating(false);
            setIsEditing(false);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Error saving allergy profile');
        }
    };

    const handleCancelEdit = async () => {
        setSelectedAllergies(initialSelectedAllergies);
        await handleRefresh();
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleStartCreatingProfile = () => {
        setIsCreating(true);
        setSelectedAllergies([]);
        setInitialSelectedAllergies([]);
    };

    const handleStartEditingProfile = () => {
        setIsEditing(true);
        setInitialSelectedAllergies(selectedAllergies);
    };

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'low':
                return 'border-yellow-600';
            case 'medium':
                return 'border-orange-600';
            case 'high':
                return 'border-red-600';
            default:
                return '';
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-100 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Allergy Profile</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
                    <div className="md:w-1/2 w-full">
                        <h2 className="text-2xl font-semibold text-black mb-4 text-center">Available Allergens</h2>
                        <ul>
                            {allergies.map((allergy) => (
                                <li key={allergy.allergen_id}
                                    className="bg-white p-4 mb-4 rounded-xl shadow text-center">
                                    <span className="font-semibold text-lg">{allergy.name}</span>
                                    {(isEditing || isCreating) && (
                                        <div className="flex justify-center space-x-3 mt-2">
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'low')}
                                                className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-gray-300"
                                                title="Low Intensity"
                                            ></button>
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'medium')}
                                                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 border border-gray-300"
                                                title="Medium Intensity"
                                            ></button>
                                            <button
                                                onClick={() => handleAddAllergy(allergy, 'high')}
                                                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 border border-gray-300"
                                                title="High Intensity"
                                            ></button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <h2 className="text-2xl font-semibold text-black mb-4 text-center">Selected Allergens</h2>
                        <ul>
                            {selectedAllergies.map(({allergenId, name, intensity}) => (
                                <li key={allergenId}
                                    className={`bg-white p-4 mb-4 rounded-xl shadow text-center border-l-4 ${getIntensityColor(intensity)} flex items-center justify-between`}>
                                    <span className="font-semibold text-lg">{name}</span>
                                    {(isEditing || isCreating) && (
                                        <button
                                            onClick={() => handleRemoveAllergy(allergenId)}
                                            className="text-red-600 hover:text-red-800 focus:outline-none"
                                        >
                                            <XCircleIcon className="h-8 w-8" aria-hidden="true"/>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
            <div className="mt-6 flex justify-center">
                {isEditing || isCreating ? (
                    <>
                        <button onClick={handleSaveProfile}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">Save Profile
                        </button>
                        <button onClick={handleCancelEdit}
                                className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">Cancel
                        </button>
                    </>
                ) : hasProfile ? (
                    <button onClick={handleStartEditingProfile}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Edit
                        Profile</button>
                ) : (
                    <button onClick={handleStartCreatingProfile}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Create
                        Profile</button>
                )}
            </div>
            {saveError && <p className="text-red-500 mt-4">{saveError}</p>}
            <ToastContainer />
        </div>
    );
};

export default AllergyProfilePage;
