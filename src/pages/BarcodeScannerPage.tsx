import BarcodeScanner from "react-qr-barcode-scanner";
import {useEffect, useState} from "react";
import {components} from "../controlfood-backend-schema";
import {getProductByEan} from "../api/api.ts";


const BarcodeScannerPage: React.FC = () => {

    const [product, setProduct] = useState<components["schemas"]["GetProductDTO"] | null>(null)
    const [data, setData] = useState<string>("");

    const fetchProductInfo = async (ean: string) => {
        console.log("Before sending:", ean);
        const productData = await getProductByEan(ean);
        console.log("Received product data:", productData);


        setProduct(productData);
    };


    useEffect(() => {
        console.log("Product state updated:", product);
    }, [product]); // This effect runs whenever product changes


    return (
        <div>
            <BarcodeScanner
                width={500}
                height={500}
                onUpdate={(_err, result) => {
                    if (result) {
                        const scannedData = result.getText();
                        setData(scannedData);
                        fetchProductInfo(scannedData);
                    }
                }}
            />
            <p>Result: {data}</p>



            {product && (
                <div>
                    <h2>Product Information</h2>
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Name:</strong> {product.productName}</p>
                    <p><strong>Description:</strong> {product.productDescription}</p>
                    <p><strong>EAN:</strong> {product.ean}</p>
                    <p><strong>Country:</strong> {product.country}</p>
                    <p><strong>Quantity:</strong> {product.productQuantity}</p>
                    <p><strong>Version:</strong> {product.version}</p>
                    <p><strong>Composition ID:</strong> {product.compositionId}</p>
                    <p><strong>Label ID:</strong> {product.labelId}</p>
                    <p><strong>Package Type ID:</strong> {product.packageTypeId}</p>
                    <p><strong>Portion ID:</strong> {product.portionId}</p>
                    <p><strong>Producer ID:</strong> {product.producerId}</p>
                    <p><strong>Unit ID:</strong> {product.unitId}</p>

                    {/* Optional nested labelDTO if it exists */}
                    {product.labelDTO && (
                        <div>
                            <h3>Label Information</h3>
                            <img
                                src={`data:image/jpeg;base64,${product.labelDTO.image}`}
                                alt={product.productName}
                                className="w-32 h-32 object-cover mb-4"
                            />
                            <p><strong>Allergens:</strong> {product.labelDTO.allergens}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BarcodeScannerPage;


