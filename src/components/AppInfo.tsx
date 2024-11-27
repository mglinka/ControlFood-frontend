const AppInfo = () => {
    return (
        <div
            className="p-12 bg-gray-100 text-gray-800 m-8 rounded-lg flex flex-col items-center w-full max-w-5xl mx-auto box-border min-h-[300px]">
            <h2 className="text-3xl text-black mb-5 text-center">ControlFood</h2>
            <p className="text-lg mb-8 leading-relaxed text-center">
                ControlFood pomaga zarządzać alergiami pokarmowymi i preferencjami żywieniowymi w prosty sposób.
                Śledź składniki, których musisz unikać.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full md:w-[80%]">

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-search text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Przeglądaj produkty</h3>
                    <p className="text-base text-gray-600">Wyszukuj produkty w naszej bazie danych Functional Food, aby znaleźć te, które odpowiadają Twoim potrzebom.</p>
                </div>

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-user-cog text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Stwórz profil alergiczny</h3>
                    <p className="text-base text-gray-600">Utwórz swój profil alergiczny, aby unikać produktów zawierających alergeny, które Cię dotyczą.</p>
                </div>

                <div
                    className="bg-white rounded-lg p-5 w-64 h-[250px] shadow-md flex flex-col items-center text-center">
                    <i className="fas fa-qrcode text-4xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl mb-2">Skanuj kod EAN</h3>
                    <p className="text-base text-gray-600">Skanuj kody EAN na produktach, aby szybko uzyskać szczegółowe informacje o ich składnikach i alergenach.</p>
                </div>
            </div>
        </div>
    );
};

export default AppInfo;
