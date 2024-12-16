import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const excludedPaths = ["/login", "/register", "/"];

    if (excludedPaths.includes(location.pathname)) {
        return null;
    }

    const translations: Record<string, string> = {
        "main-page": "Strona Główna",
        "products": "Produkty",
        "categories": "Kategorie",
        "about-us": "O Nas",
        "contact": "Kontakt",
        "profile": "Profil alergiczny",
        "scanner": "Skaner",
        "products-specialist": "Produkty",
        "create-product": "Stwórz produkt",
        "create-allergen": "Stwórz alergen",
        "my-account": "Moje konto",
        "schemas": "Szablony",
        "safe-products": "Bezpieczne produkty",
    };

    const isMainPage = location.pathname === "/main-page";
    const containerClass = isMainPage ? "bg-black" : "bg-white";
    const textClass = isMainPage ? "text-white" : "text-gray-700";
    const navClass = isMainPage ? "my-4 px-4" : "my-4 px-4";

    // Jeśli jesteśmy na stronie głównej, wyświetlamy tylko jeden breadcrumb
    if (isMainPage) {
        return (
            <div className={`${containerClass} m-0 p-3`}>
                <nav aria-label="breadcrumb" className={`flex items-center ${navClass}`}>
                    <ul className={`flex items-center space-x-2 ${textClass}`}>
                        <li>
                            <span className="bg-gray-700 text-white px-3 py-1 rounded-md font-medium">
                                {translations["main-page"]}
                            </span>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    return (
        <div className={`${containerClass} ${isMainPage ? "m-0 p-3" : ""}`}>
            <nav aria-label="breadcrumb" className={`flex items-center ${navClass}`}>
                <ul className={`flex items-center space-x-2 ${textClass}`}>
                    <li>
                        <Link
                            to="/main-page"
                            className={`${
                                isMainPage
                                    ? "bg-black text-white hover:bg-gray-700"
                                    : "bg-gray-200 hover:bg-gray-300 text-blue-700"
                            } px-3 py-1 rounded-md font-medium`}
                        >
                            {translations["main-page"]}
                        </Link>
                    </li>

                    {pathnames.map((value, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathnames.length - 1;

                        const formattedValue = translations[value] || value
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ");

                        return (
                            <React.Fragment key={routeTo}>
                                <ChevronRightIcon
                                    className={`w-4 h-4 ${
                                        isMainPage ? "text-white" : "text-gray-500"
                                    }`}
                                    aria-hidden="true"
                                />
                                <li>
                                    {isLast ? (
                                        <span
                                            className={`${
                                                isMainPage
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-blue-100 text-blue-700"
                                            } px-3 py-1 rounded-md font-medium`}
                                        >
                                            {formattedValue}
                                        </span>
                                    ) : (
                                        <Link
                                            to={routeTo}
                                            className={`${
                                                isMainPage
                                                    ? "bg-black text-white hover:bg-gray-700"
                                                    : "bg-gray-200 hover:bg-gray-300 text-blue-700"
                                            } px-3 py-1 rounded-md font-medium`}
                                        >
                                            {formattedValue}
                                        </Link>
                                    )}
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Breadcrumbs;
