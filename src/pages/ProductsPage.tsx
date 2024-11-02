import React, { useEffect, useState } from 'react';
import { getAllProducts, getAllergyProfileByAccountId } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { authService } from "../utils/authService.ts";

const placeholderImage = '/default-placeholder.png';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<components["schemas"]["GetProductDTO"][]>([]);
    const [selectedProduct, setSelectedProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const size = 16;
    const totalPages = 9;

    // State to hold allergen profile
    const [allergenProfile, setAllergenProfile] = useState<{ allergen_id: string; name: string; intensity: string }[]>([]);

    // Define color mapping for allergen intensity
    const intensityColors: Record<string, string> = {
        low: 'bg-yellow-300',    // Yellow for low intensity
        medium: 'bg-orange-300',  // Orange for medium intensity
        high: 'bg-red-300'        // Red for high intensity
    };

    useEffect(() => {
        const fetchAllergyProfile = async () => {
            try {
                const accountId = authService.getAccountId(); // Assuming you have a way to get the account ID
                if (accountId === null) {
                    return;
                }
                const profileData = await getAllergyProfileByAccountId(accountId);
                setAllergenProfile(profileData.allergens); // Assuming this returns a list of allergens with their intensities
            } catch (error) {
                console.error('Error fetching allergy profile:', error);
                setError('Error fetching allergy profile.');
            }
        };

        fetchAllergyProfile();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllProducts(page, size);
                console.log('Fetched Data:', data);

                const sortedProducts = data.sort((a: any, b: any) => {
                    const aHasImage = a.labelDTO?.image ? 1 : 0;
                    const bHasImage = b.labelDTO?.image ? 1 : 0;
                    return bHasImage - aHasImage;
                });

                setProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    const closeModal = () => setSelectedProduct(null);

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(prevPage => prevPage - 1);
        }
    };

    // Function to get allergen intensity based on the user's profile
    const getAllergenIntensity = (allergen: string) => {
        const profileAllergen = allergenProfile.find(a => a.name.toLowerCase() === allergen.toLowerCase());
        return profileAllergen ? profileAllergen.intensity.toLowerCase() : 'unknown';
    };

    return (
        <div className="p-6">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-gray-600" />
                </div>
            ) : error ? (
                <div>{error}</div>
            ) : products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="flex flex-col items-center flex-grow">
                                    <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                                        <img
                                            src={product.labelDTO?.image ? `data:image/jpeg;base64,${product.labelDTO.image}` : placeholderImage}
                                            alt={product.productName || "Product Image"}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <h2 className="font-semibold text-lg text-center">{product.productName || "Unnamed Product"}</h2>
                                    <p className="mt-2 text-center text-gray-600">{product.productDescription || "No description available."}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 0}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                            Previous
                        </button>
                        <span className="self-center text-gray-700">Page {page + 1} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={page >= totalPages - 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl p-2"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">Product Details</h2>

                        <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                            <img
                                src={selectedProduct.labelDTO?.image ? `data:image/jpeg;base64,${selectedProduct.labelDTO.image}` : placeholderImage}
                                alt={selectedProduct.productName || "Product Image"}
                                className="object-contain w-full h-full"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            <div className="mt-2 text-center text-gray-600">
                                <h3 className="font-semibold">Product Name:</h3>
                                <p>{selectedProduct.productName || "Unnamed Product"}</p>
                            </div>

                            <div className="mt-2 text-center text-gray-600">
                                <h3 className="font-semibold">Allergens:</h3>
                                {selectedProduct.labelDTO?.allergens ? (
                                    selectedProduct.labelDTO.allergens.split(',').map(allergen => {
                                        const allergenTrimmed = allergen.trim();
                                        const intensity = getAllergenIntensity(allergenTrimmed);
                                        const bgColor = intensityColors[intensity] || 'bg-gray-300'; // Fallback color

                                        return (
                                            <div key={allergenTrimmed} className={`flex justify-center items-center rounded-lg ${bgColor} text-white p-2 my-1`}>
                                                <span>{allergenTrimmed}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No allergens listed.</p>
                                )}
                            </div>

                            {selectedProduct.labelDTO?.allergens && (
                                <div className="flex items-center justify-center mt-4 p-2 border border-red-400 bg-red-100 rounded-lg">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
                                    <span className="text-red-700">This product contains allergens. Please check carefully!</span>
                                </div>
                            )}

                            <div className="mt-2 text-center text-gray-600">
                                <h3 className="font-semibold">Ingredients:</h3>
                                {selectedProduct.compositionDTO?.ingredientDTOS && selectedProduct.compositionDTO.ingredientDTOS.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {selectedProduct.compositionDTO.ingredientDTOS.map((ingredient, index) => (
                                            <li key={index}>{ingredient.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No ingredients listed.</p>
                                )}
                            </div>

                            <div className="mt-2 text-center text-gray-700">
                                <h3 className="font-semibold">Description:</h3>
                                <p>{selectedProduct.productDescription || "No description available."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
