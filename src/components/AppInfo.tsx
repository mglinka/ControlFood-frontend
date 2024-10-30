const AppInfo = () => {
    return (
        <div className="p-12 bg-gray-100 text-gray-800 m-8 rounded-lg flex flex-col items-center w-full max-w-5xl mx-auto box-border min-h-[300px]">
            <h2 className="text-3xl text-black mb-5 text-center">About ControlFood</h2>
            <p className="text-lg mb-8 leading-relaxed text-center">
                ControlFood helps you manage your food allergies and dietary preferences easily.
                Keep track of the ingredients you need to avoid, discover suitable recipes,
                and enjoy a personalized dining experience.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
                <div className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-utensils text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Track Ingredients</h3>
                    <p className="text-base text-gray-600">Easily track ingredients in your meals to avoid allergens.</p>
                </div>
                <div className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-heart text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Personalized Diet</h3>
                    <p className="text-base text-gray-600">Get personalized food suggestions based on your preferences.</p>
                </div>
                <div className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-clipboard-list text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Customizable Plans</h3>
                    <p className="text-base text-gray-600">Set your dietary goals and let us help you stick to them.</p>
                </div>
            </div>
        </div>
    );
};

export default AppInfo;
