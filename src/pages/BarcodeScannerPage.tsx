import BarcodeScanner from "react-qr-barcode-scanner";
import { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import { getProductByEan } from "../api/api.ts";

const BarcodeScannerPage: React.FC = () => {
    const [product, setProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [data, setData] = useState<string>("");

    const fetchProductInfo = async (ean: string) => {
        console.log("Before sending:", ean);
        const productData = await getProductByEan(ean);
        console.log("Received product data:", productData);
        setProduct(productData);
    };

    useEffect(() => {
        console.log("Product state updated:", product);
    }, [product]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center md:items-start md:justify-between gap-8 p-4 md:p-12">
            <div className="flex justify-center w-full md:w-1/2">
                <BarcodeScanner
                    width={400}
                    height={400}
                    onUpdate={(_err, result) => {
                        if (result) {
                            const scannedData = result.getText();
                            setData(scannedData);
                            fetchProductInfo(scannedData);
                        }
                    }}
                />
            </div>

            <div className="flex flex-col items-center md:items-start w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
                <p className="text-center md:text-left font-semibold text-lg mb-4">Scanned Result: {data}</p>

                {product ? (
                    <div className="text-gray-800 w-full">
                        <h2 className="text-2xl font-bold mb-4">Product Information</h2>
                        <p><strong>Name:</strong> {product.productName}</p>
                        <p><strong>Description:</strong> {product.productDescription}</p>
                        <p><strong>EAN:</strong> {product.ean}</p>
                        <p><strong>Country:</strong> {product.country}</p>
                        <p><strong>Durability:</strong> {product.labelDTO?.durability}</p>
                        <p><strong>Storage:</strong> {product.labelDTO?.storage}</p>
                        <p><strong>Preparation:</strong> {product.labelDTO?.preparation}</p>
                        <p><strong>Instructions after opening:</strong> {product.labelDTO?.instructionsAfterOpening}</p>

                        {product.labelDTO && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2">Label Information</h3>
                                <img
                                    src={`data:image/jpeg;base64,${product.labelDTO.image}`}
                                    alt={product.productName}
                                    className="w-full h-48 object-contain mb-4"
                                />
                                <p><strong>Allergens:</strong> {product.labelDTO.allergens}</p>
                            </div>
                        )}

                        {/* Ingredients Section */}
                        {product.compositionDTO?.ingredientDTOS && product.compositionDTO.ingredientDTOS.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                                <ul className="list-disc list-inside">
                                    {product.compositionDTO.ingredientDTOS.map((ingredient, index) => (
                                        <li key={index}>{ingredient.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">No product data available. Scan a barcode to see details.</p>
                )}
            </div>
        </div>
    );
};

export default BarcodeScannerPage;
