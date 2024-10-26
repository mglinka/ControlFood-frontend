import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Błąd podczas pobierania produktów:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {products.map(product => (
                <div key={product.id} className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col"> {/* Zmieniono na flex-col i dodano h-full */}
                    <div className="flex flex-col items-center flex-grow">
                        {product.labelDTO?.image && (
                            <img
                                src={`data:image/jpeg;base64,${product.labelDTO.image}`}
                                alt={product.productName}
                                className="w-32 h-32 object-cover mb-4"
                            />
                        )}
                        <h2 className="font-semibold text-lg text-center">{product.productName}</h2>
                        <p className="mt-2 text-center text-gray-600">{product.productDescription}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsPage;
