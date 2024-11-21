const AppInfo = () => {
    return (
        <div
            className="p-12 bg-gray-100 text-gray-800 m-8 rounded-lg flex flex-col items-center w-full max-w-5xl mx-auto box-border min-h-[300px]">
            <h2 className="text-3xl text-black mb-5 text-center">About ControlFood</h2>
            <p className="text-lg mb-8 leading-relaxed text-center">
                ControlFood helps you manage your food allergies and dietary preferences easily.
                Keep track of the ingredients you need to avoid.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full md:w-[80%]">

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-search text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Browse Products</h3>
                    <p className="text-base text-gray-600">Search products in our database to find the ones that fit
                        your needs.</p>
                    <p className="text-sm text-gray-500 mt-2">Powered by Functional Food database, providing accurate
                        and comprehensive product information.</p>
                </div>

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-user-cog text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Create Allergy Profile</h3>
                    <p className="text-base text-gray-600">Create your allergy profile to avoid products containing
                        allergens that affect you.</p>
                </div>

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-qrcode text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Scan EAN Barcode</h3>
                    <p className="text-base text-gray-600">Scan EAN barcodes on products to quickly get detailed
                        information about their ingredients and allergens.</p>
                </div>
            </div>
        </div>
    );
};

export default AppInfo;
