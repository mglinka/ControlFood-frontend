import React, { useEffect, useState } from 'react';
import {
    getAllergyProfileByAccountId,
    getAllProducts,
    getCategories,
    getProductsByCategory,

} from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import { authService } from "../utils/authService.ts";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const placeholderImage = '/default-placeholder.png';

const ProductsPage: React.FC = () => {

    const [products, setProducts] = useState<components["schemas"]["GetProductDTO"][]>([]);
    const [selectedProduct, setSelectedProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [categories, setCategories] = useState<components["schemas"]["GetCategoryDTO"][]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const size = 16;
    const totalPages = 9;
    const [searchQuery, setSearchQuery] = useState("");

    const [allergenProfile, setAllergenProfile] = useState<{
        allergen_id: string;
        name: string;
        intensity: string
    }[]>([]);

    useEffect(() => {
        const fetchAllergyProfile = async () => {
            try {
                const accountId = authService.getAccountId();
                if (accountId === null) {
                    return;
                }
                const profileData = await getAllergyProfileByAccountId(accountId);
                setAllergenProfile(profileData.allergens);
            } catch (error) {
                console.error('Error fetching allergy profile:', error);
            }
        };

        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Error fetching categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllergyProfile();
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let data;

                if (selectedCategory) {
                    // Pobieranie produktów na podstawie kategorii z uwzględnieniem wyszukiwania
                    data = await getProductsByCategory(selectedCategory);

                    // Filtrowanie produktów po nazwie w ramach wybranej kategorii
                    if (searchQuery) {
                        const lowerCaseQuery = searchQuery.toLowerCase();
                        data = data.filter((product: components["schemas"]["GetProductDTO"]) =>
                            product.productName?.toLowerCase().includes(lowerCaseQuery)
                        );
                    }
                } else {
                    // Pobieranie wszystkich produktów z paginacją i wyszukiwanie globalne
                    data = await getAllProducts(page, size, searchQuery);
                }

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
    }, [page, selectedCategory, searchQuery]);


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

    const getAllergenIntensity = (allergen: string) => {
        const profileAllergen = allergenProfile.find(a => a.name.toLowerCase() === allergen.toLowerCase());
        return profileAllergen ? profileAllergen.intensity.toLowerCase() : 'unknown';
    };

    return (
        <div className="p-6">
            <div className="relative w-full my-4 flex items-center">
                {/* Search Input */}
                <div className="relative w-3/4">
                    <input
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setPage(0);
                        }}
                        className="w-full px-6 py-2 bg-white text-black rounded-full border-2 border-black focus:outline-none focus:border-black placeholder-gray-400 pl-12"
                        type="text"
                        placeholder="Szukaj"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                    </span>
                </div>

                {/* Category Selector */}
                <div className="relative w-1/4 ml-4">
                    <select
                        onChange={(event) => {
                            const selectedCategoryId = event.target.value;
                            const selectedCategory = categories.find(category => category.id === selectedCategoryId);
                            if (selectedCategory) {
                                setSelectedCategory(selectedCategory.name as string);
                            } else {
                                setSelectedCategory("");
                            }
                            setPage(0);
                        }}
                        className="w-full px-4 py-2 bg-white text-black rounded-full border-2 border-black focus:outline-none focus:border-black appearance-none cursor-pointer"
                        style={{
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                        }}
                    >
                        <option value="" className="rounded-lg">
                            Wybierz kategorię
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} className="rounded-lg">
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-gray-600" />
                </div>
            ) : error ? (
                <div>{error}</div>
            ) : products.length === 0 ? (
                <p></p>
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

                    {!searchQuery && !selectedCategory && (
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 0}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-6 h-6" />
                            </button>
                            <span className="self-center text-gray-700">Page {page + 1} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={page >= totalPages - 1}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            >
                                <FontAwesomeIcon icon={faArrowRight} className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] md:h-auto md:max-h-[80vh] overflow-hidden relative flex flex-col md:flex-row gap-6"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl p-2"
                        >
                            &times;
                        </button>

                        <div className="flex-1 overflow-y-auto pr-0 md:pr-4">
                            <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={selectedProduct.labelDTO?.image ? `data:image/jpeg;base64,${selectedProduct.labelDTO.image}` : placeholderImage}
                                    alt={selectedProduct.productName || "Product Image"}
                                    className="object-contain w-full h-full"
                                />
                            </div>

                            <div className="text-gray-700 space-y-4">
                                <div className="text-center">
                                    <h3 className="font-semibold text-lg">Nazwa produktu:</h3>
                                    <p>{selectedProduct.productName || "Unnamed Product"}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Alergeny:</h3>
                                    {selectedProduct.labelDTO?.allergens ? (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {selectedProduct.labelDTO.allergens.split(',').map(allergen => {
                                                const allergenTrimmed = allergen.trim();
                                                const intensity = getAllergenIntensity(allergenTrimmed);

                                                // Zdefiniowane kolory w zależności od intensywności
                                                let bgColor = '';
                                                switch (intensity) {
                                                    case 'low':
                                                        bgColor = 'bg-yellow-500'; // Żółty
                                                        break;
                                                    case 'medium':
                                                        bgColor = 'bg-orange-600'; // Pomarańczowy
                                                        break;
                                                    case 'high':
                                                        bgColor = 'bg-red-600'; // Czerwony
                                                        break;
                                                    default:
                                                        bgColor = 'bg-gray-500';// Szary, jeśli brak intensywności
                                                }

                                                return (
                                                    <div
                                                        key={allergenTrimmed}
                                                        className={`relative group flex items-center justify-center px-4 py-2 rounded-full text-white ${bgColor} cursor-pointer hover:scale-105 transform transition duration-200 text-sm`}
                                                    >
                                                        <span className="font-semibold">{allergenTrimmed}</span>

                                                        {/* Tooltip - pojawia się tylko dla kolorów innych niż szary */}
                                                        {bgColor !== 'bg-gray-500' && (
                                                            <div
                                                                className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-700 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg pointer-events-none"
                                                            >
                                                                Intensywność {' '}
                                                                {intensity === 'low'
                                                                    ? 'niska'
                                                                    : intensity === 'medium'
                                                                        ? 'średnia'
                                                                        : 'wysoka'}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p>Brak alergenów w produkcie.</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold">Składniki:</h3>
                                    {selectedProduct.compositionDTO?.ingredientDTOS && selectedProduct.compositionDTO.ingredientDTOS.length > 0 ? (
                                        <ul className="list-disc list-inside ml-4">
                                            {selectedProduct.compositionDTO.ingredientDTOS.map((ingredient, index) => (
                                                <li key={index}>{ingredient.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Brak składników w produkcie</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold">Opis:</h3>
                                    <p>{selectedProduct.productDescription || "No description available."}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-center font-semibold text-lg mb-4 text-black">Tabela wartości
                                odżywczych</h3>
                            <div className="overflow-x-auto">
                                <table
                                    className="table-auto border-collapse border border-gray-800 w-full text-sm text-left text-black">
                                    <thead>
                                    <tr className="bg-white text-black text-center">
                                        <th className="border border-gray-400 px-4 py-2">Grupa wartości odżywczych</th>
                                        <th className="border border-gray-400 px-4 py-2">Wartość odżywcza</th>
                                        <th className="border border-gray-400 px-4 py-2">100g/ml</th>
                                        <th className="border border-gray-400 px-4 py-2">% NRV</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedProduct?.nutritionalValueDTOS.map((value, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                        >
                                            <td className="border border-gray-400 px-4 py-2 font-semibold">
                                                {value.nutritionalValueName?.group?.groupName || "Unknown Group"}
                                            </td>
                                            <td className="border border-gray-400 px-4 py-2 font-semibold">
                                                {value.nutritionalValueName?.name || "Unknown Value"}
                                            </td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                {value.quantity !== undefined ? value.quantity : "-"} {value.unit?.name || "No Unit"}
                                            </td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                {value.nrv !== undefined ? `${value.nrv.toFixed(1)}%` : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

            )}
        </div>
    );
};

export default ProductsPage;
