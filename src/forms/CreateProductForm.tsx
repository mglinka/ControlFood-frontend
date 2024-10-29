import { useState } from "react";

export function CreateProductForm() {
    const units = [
        { id: '5cb4dab8-1a8d-42d3-bc99-216c28df1297', name: '' },
        { id: '1f1a1959-43e7-4d14-ab02-a3631aec9967', name: 'mcg' },
        { id: 'a9069766-d492-410f-afe7-c11793bbeb5c', name: 'kcal' },
        { id: '02df2e69-a615-4460-bb41-a917d5b8b20e', name: 'j.m.' },
        { id: '54a850b7-ad94-4ffa-848e-49dd90789b8f', name: 'g' },
        { id: '84b2319d-6332-419f-9288-3bd624e4a501', name: 'szt.' },
        { id: '533da95b-c272-43be-b647-ca99e9bd8efe', name: 'mg' },
        { id: '354b6d6f-91e0-48d3-ba18-6e5f4e996c49', name: 'l' },
        { id: 'a1f7dee2-d256-4495-afd5-b7bdb483a37f', name: 'ml' }
    ];

    const [createProduct, setCreateProduct] = useState({
        ean: '',
        producerDTO: {
            name: '',
            address: '',
            countryCode: undefined,
            contact: '',
            nip: '',
            rmsd: undefined,
        },
        productName: '',
        productDescription: '',
        productQuantity: undefined,
        unitDTO: {
            name: ''
        },
        packageTypeDTO: {
            name: ''
        },
        country: '',
        compositionDTO: {
            ingredientDTOS: [],
            additionDTOS: [],
            flavourDTO: null,
        },
        nutritionalIndexDTOS: [],
        productIndexDTOS: [],
        labelDTO: {
            storage: '',
            durability: '',
            instructionsAfterOpening: '',
            preparation: '',
            allergens: '',
            image: '',
        },
        portionDTO: {
            portionQuantity: undefined,
            unitDTO: {
                name: ''
            }
        },
        ratingDTOS: [],
        nutritionalValueDTOS: [],
    });

    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedPortionUnit, setSelectedPortionUnit] = useState('');

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setCreateProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUnitChange = (e:any) => {
        const selectedUnitId = e.target.value;
        const unit = units.find(unit => unit.id === selectedUnitId);
        setSelectedUnit(unit ? unit.name : '');
        setCreateProduct(prev => ({
            ...prev,
            unitDTO: {
                name: unit ? unit.name : ''
            }
        }));
    };

    const handlePortionUnitChange = (e:any) => {
        const selectedUnitId = e.target.value;
        const unit = units.find(unit => unit.id === selectedUnitId);
        setSelectedPortionUnit(unit ? unit.name : ''); // Update selected portion unit state
        setCreateProduct(prev => ({
            ...prev,
            portionDTO: {
                ...prev.portionDTO,
                unitDTO: {
                    name: unit ? unit.name : ''
                }
            }
        }));
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        console.log("Product Created: ", createProduct);
        // Here you can add the logic to send createProduct to your API.
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-2xl font-bold">Create Product</h2>

            <div>
                <label className="block mb-1">EAN:</label>
                <input
                    type="text"
                    name="ean"
                    value={createProduct.ean}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold">Producer Information</h3>
                <label className="block mb-1">Name:</label>
                <input
                    type="text"
                    name="producerDTO.name"
                    value={createProduct.producerDTO.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Address:</label>
                <input
                    type="text"
                    name="producerDTO.address"
                    value={createProduct.producerDTO.address}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Country Code:</label>
                <input
                    type="number"
                    name="producerDTO.countryCode"
                    value={createProduct.producerDTO.countryCode || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Contact:</label>
                <input
                    type="text"
                    name="producerDTO.contact"
                    value={createProduct.producerDTO.contact}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">NIP:</label>
                <input
                    type="text"
                    name="producerDTO.nip"
                    value={createProduct.producerDTO.nip}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">RMSD:</label>
                <input
                    type="number"
                    name="producerDTO.rmsd"
                    value={createProduct.producerDTO.rmsd || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block mb-1">Product Name:</label>
                <input
                    type="text"
                    name="productName"
                    value={createProduct.productName}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block mb-1">Product Description:</label>
                <textarea
                    name="productDescription"
                    value={createProduct.productDescription}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block mb-1">Product Quantity:</label>
                <input
                    type="number"
                    name="productQuantity"
                    value={createProduct.productQuantity || ''}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            {/* Combined Unit Selection and Display */}
            <div>
                <label className="block mb-1">Unit:</label>
                <select
                    name="unit"
                    value={selectedUnit}
                    onChange={handleUnitChange}
                    className="border p-2 w-full mb-2"
                >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={selectedUnit}
                    readOnly
                    className="border p-2 w-full bg-gray-200"
                />
            </div>


            <div>
                <label className="block mb-1">Portion Quantity:</label>
                <input
                    type="number"
                    name="portionDTO.portionQuantity"
                    value={createProduct.portionDTO.portionQuantity || ''}
                    onChange={handleChange}
                    className="border p-2 w-full mb-2"
                />

                <label className="block mb-1">Portion Unit:</label>
                <select
                    name="portionUnit"
                    value={selectedPortionUnit}
                    onChange={handlePortionUnitChange}
                    className="border p-2 w-full mb-2"
                >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={selectedPortionUnit}
                    readOnly
                    className="border p-2 w-full bg-gray-200"
                />
            </div>

            <div>
                <label className="block mb-1">Package Type Name:</label>
                <input
                    type="text"
                    name="packageTypeDTO.name"
                    value={createProduct.packageTypeDTO.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block mb-1">Country:</label>
                <input
                    type="text"
                    name="country"
                    value={createProduct.country}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold">Label Information</h3>
                <label className="block mb-1">Storage:</label>
                <input
                    type="text"
                    name="labelDTO.storage"
                    value={createProduct.labelDTO.storage}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Durability:</label>
                <input
                    type="text"
                    name="labelDTO.durability"
                    value={createProduct.labelDTO.durability}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Instructions After Opening:</label>
                <input
                    type="text"
                    name="labelDTO.instructionsAfterOpening"
                    value={createProduct.labelDTO.instructionsAfterOpening}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Preparation:</label>
                <input
                    type="text"
                    name="labelDTO.preparation"
                    value={createProduct.labelDTO.preparation}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Allergens:</label>
                <input
                    type="text"
                    name="labelDTO.allergens"
                    value={createProduct.labelDTO.allergens}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <label className="block mb-1">Image URL:</label>
                <input
                    type="text"
                    name="labelDTO.image"
                    value={createProduct.labelDTO.image}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Create Product
            </button>
        </form>
    );
}
