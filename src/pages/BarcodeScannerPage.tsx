import BarcodeScanner from "react-qr-barcode-scanner";
import { useEffect, useState } from "react";
import { components } from "../controlfood-backend-schema";
import { getProductByEan } from "../api/api.ts";
import {getAllergyProfileByAccountId} from '../api/api.ts';
import {authService} from "../utils/authService.ts";

const BarcodeScannerPage: React.FC = () => {
    const [product, setProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null);
    const [data, setData] = useState<string>("");
    const [allergenProfile, setAllergenProfile] = useState<{
        allergen_id: string;
        name: string;
        intensity: string
    }[]>([]);

    const fetchProductInfo = async (ean: string) => {
        const productData = await getProductByEan(ean);
        setProduct(productData);
    };

    const getAllergenIntensity = (allergen: string) => {
        const profileAllergen = allergenProfile.find(a => a.name.toLowerCase() === allergen.toLowerCase());
        return profileAllergen ? profileAllergen.intensity.toLowerCase() : 'unknown';
    };

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
        fetchAllergyProfile();
    }, []);

    useEffect(() => {
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
                {product ? (
                    <div className="text-gray-800 w-full">
                        <p className="text-center md:text-left font-semibold text-lg mb-4">Zeskanowany kod EAN: {data}</p>

                        <h2 className="text-2xl font-bold mb-4">Informacje o produkcie</h2>
                        <p><strong>Nazwa produktu:</strong> {product.productName}</p>
                        <p><strong>Opis:</strong> {product.productDescription}</p>
                        <p><strong>Kategoria:</strong> {product.categoryDTO?.name}</p>
                        <p><strong>EAN:</strong> {product.ean}</p>
                        <p><strong>Kraj:</strong> {product.country}</p>
                        <p><strong>Data ważności:</strong> {product.labelDTO?.durability}</p>
                        <p><strong>Przechowywanie:</strong> {product.labelDTO?.storage}</p>
                        <p><strong>Przygotowanie:</strong> {product.labelDTO?.preparation}</p>
                        <p><strong>Instrukcje po otwarciu:</strong> {product.labelDTO?.instructionsAfterOpening}</p>

                        {product.labelDTO && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2">Informacje na etykiecie</h3>
                                <img
                                    src={`data:image/jpeg;base64,${product.labelDTO.image}`}
                                    alt={product.productName}
                                    className="w-full h-48 object-contain mb-4"
                                />

                                <h4 className="font-semibold">Alergeny:</h4>
                                {product.labelDTO.allergens ? (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {product.labelDTO.allergens.split(',').map(allergen => {
                                            const allergenTrimmed = allergen.trim();
                                            const intensity = getAllergenIntensity(allergenTrimmed);

                                            let bgColor = '';
                                            switch (intensity) {
                                                case 'low':
                                                    bgColor = 'bg-yellow-500';
                                                    break;
                                                case 'medium':
                                                    bgColor = 'bg-orange-600';
                                                    break;
                                                case 'high':
                                                    bgColor = 'bg-red-600';
                                                    break;
                                                default:
                                                    bgColor = 'bg-gray-500';
                                            }

                                            return (
                                                <div
                                                    key={allergenTrimmed}
                                                    className={`relative group flex items-center justify-center px-4 py-2 rounded-full text-white ${bgColor} cursor-pointer hover:scale-105 transform transition duration-200 text-sm`}
                                                >
                                                    <span className="font-semibold">{allergenTrimmed}</span>

                                                    {bgColor !== 'bg-gray-500' && (
                                                        <div
                                                            className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-700 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg pointer-events-none"
                                                        >
                                                            Intensywność {' '}
                                                            {intensity === 'low' ? 'niska' : intensity === 'medium' ? 'średnia' : 'wysoka'}
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
                        )}


                        {/* Ingredients Section */}
                        {product.compositionDTO?.ingredientDTOS && product.compositionDTO.ingredientDTOS.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2">Składniki</h3>
                                <ul className="list-disc list-inside">
                                    {product.compositionDTO.ingredientDTOS.map((ingredient, index) => (
                                        <li key={index}>{ingredient.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Nutritional Values Section */}
                        {product.nutritionalValueDTOS && product.nutritionalValueDTOS.length > 0 && (
                            <div className="flex-1 overflow-y-auto mt-4">
                                <h3 className="text-center font-semibold text-lg mb-4 text-black">Tabela wartości odżywczych</h3>
                                <div className="overflow-x-auto">
                                    <table className="table-auto border-collapse border border-gray-800 w-full text-sm text-left text-black">
                                        <thead>
                                        <tr className="bg-white text-black text-center">
                                            <th className="border border-gray-400 px-4 py-2">Grupa wartości odżywczych</th>
                                            <th className="border border-gray-400 px-4 py-2">Wartość odżywcza</th>
                                            <th className="border border-gray-400 px-4 py-2">100g/ml</th>
                                            <th className="border border-gray-400 px-4 py-2">% NRV</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {product.nutritionalValueDTOS.map((value, index) => (
                                            <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
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
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600 font-bold ">Zeskanuj kod EAN</p>
                )}
            </div>
        </div>
    );
};

export default BarcodeScannerPage;
