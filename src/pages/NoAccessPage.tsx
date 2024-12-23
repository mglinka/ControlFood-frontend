import { Link } from 'react-router-dom';


const NoAccessPage = () => {

    return (
        <div className="flex items-center justify-center h-screen w-screen text-white">
            <div className="flex items-center justify-center w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                <div className="text-center w-full">
                    <h1 className="text-3xl font-extrabold text-red-600">Brak dostępu!</h1>
                    <p className="mt-4 text-lg text-gray-800">
                        Nie masz wystarczających uprawnień, aby zobaczyć tę stronę.
                    </p>
                    <div className="mt-8">
                        <Link
                            to="/"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold  rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Wróć na stronę główną
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoAccessPage;
