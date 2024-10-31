import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/api.ts';
import { components } from "../controlfood-backend-schema";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<components["schemas"]["GetProductDTO"][]>([]);
    const [selectedProduct, setSelectedProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const size = 16;
    const totalPages = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllProducts(page, size);
                console.log('Fetched Data:', data);

                const sortedProducts = data.sort((a:any, b:any) => {
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

    return (
        <div className="p-6">
            {loading ? (
                <div>Loading...</div>
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
                                    {product.labelDTO?.image && (
                                        <div className="w-32 h-32 mb-4 overflow-hidden rounded-lg">
                                            <img
                                                src={`data:image/jpeg;base64,${product.labelDTO.image}`}
                                                alt={product.productName || "Product Image"}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <h2 className="font-semibold text-lg text-center">{product.productName || "Unnamed Product"}</h2>
                                    <p className="mt-2 text-center text-gray-600">{product.productDescription || "No description available."}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
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

            {/* Modal for Selected Product */}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-center">{selectedProduct.productName || "Unnamed Product"}</h2>
                        {selectedProduct.labelDTO?.image && (
                            <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={`data:image/jpeg;base64,${selectedProduct.labelDTO.image}`}
                                    alt={selectedProduct.productName || "Product Image"}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        )}
                        <p className="mt-2 text-center text-gray-600">{selectedProduct.labelDTO?.allergens || "No allergens listed."}</p>
                        <p className="text-center text-gray-700">{selectedProduct.productDescription || "No description available."}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
