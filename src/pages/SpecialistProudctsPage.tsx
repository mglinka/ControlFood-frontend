import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faSpinner} from '@fortawesome/free-solid-svg-icons';

const placeholderImage = '/default-placeholder.png';

const SpecialistProductsPage: React.FC = () => {
    const [products, setProducts] = useState<components["schemas"]["GetProductDTO"][]>([]);
    const [selectedProduct, setSelectedProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const size = 16;
    const totalPages = 9;
    const [searchQuery, setSearchQuery] = useState("");

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

    useEffect(() => {
        const timeId = setTimeout(() => {
                const fetchProducts = async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const data = await getAllProducts(page, size, searchQuery);
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
                fetchProducts();}
            , 1000)
        return () => clearTimeout(timeId)
    }, [searchQuery]);



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



    return (
        <div className="p-6">
            <div className="relative w-full my-4">
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
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5"/>
            </span>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xl text-gray-600"/>
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
                                className="border border-gray-300 p-4 rounded-lg shadow-md h-full flex flex-col cursor-pointer"
                                onClick={() => setSelectedProduct(product)} // No hover effect or color change
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
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-25 bg-gray-900 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative overflow-auto max-h-[80vh]">

                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl p-2"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center md:col-span-2">Product Details</h2>

                        {/* Flex container for both columns */}
                        <div className="flex w-full space-x-6 overflow-auto">

                            {/* Left Column - Product Info */}
                            <div className="w-2/5 overflow-y-auto pr-4 space-y-4">
                                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                                    <img
                                        src={selectedProduct.labelDTO?.image ? `data:image/jpeg;base64,${selectedProduct.labelDTO.image}` : placeholderImage}
                                        alt={selectedProduct.productName || "Product Image"}
                                        className="object-contain w-full h-full"
                                    />
                                </div>

                                <div className="mt-2 text-center text-gray-600">
                                    <h3 className="font-semibold">Product Name:</h3>
                                    <p>{selectedProduct.productName || "Unnamed Product"}</p>
                                </div>

                                <div className="mt-2 text-center text-gray-600">
                                    <h3 className="font-semibold">Allergens:</h3>
                                    {selectedProduct.labelDTO?.allergens ? (
                                        <div className="flex flex-wrap justify-center space-x-2">
                                            {/* Layout Chips for allergens */}
                                            {selectedProduct.labelDTO.allergens.split(',').map((allergen, index) => (
                                                <span key={index} className="bg-orange-200 text-black text-sm font-semibold px-4 py-2 rounded-full">
                                        {allergen.trim()}
                                    </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No allergens listed.</p>
                                    )}
                                </div>

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

                            {/* Right Column - Nutritional Values Table */}
                            <div className="w-3/5 overflow-y-auto pl-4 space-y-4">
                                <h3 className="text-center font-semibold text-lg mb-4">Nutritional Values</h3>
                                <div className="overflow-x-auto">
                                    <table className="table-auto border-collapse border border-gray-200 w-full text-sm text-left rounded-lg shadow-md overflow-hidden">
                                        <thead className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
                                        <tr className="text-center">
                                            <th className="border border-gray-300 px-4 py-3 rounded-tl-lg">Nutritional Group</th>
                                            <th className="border border-gray-300 px-4 py-3">Nutritional Value</th>
                                            <th className="border border-gray-300 px-4 py-3">Per 100g/ml</th>
                                            <th className="border border-gray-300 px-4 py-3 rounded-tr-lg">% NRV</th>
                                        </tr>
                                        </thead>
                                        <tbody className="text-gray-700">
                                        {selectedProduct?.nutritionalValueDTOS.map((value, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50 hover:bg-orange-100 transition-colors" : "hover:bg-orange-100 transition-colors"}>
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    {value.nutritionalValueName?.group?.groupName || "Unknown Group"}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    {value.nutritionalValueName?.name || "Unknown Value"}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {value.quantity !== undefined ? value.quantity : "-"} {value.unit?.name || "No Unit"}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
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
                </div>
            )}


        </div>
    );
};

export default SpecialistProductsPage;
