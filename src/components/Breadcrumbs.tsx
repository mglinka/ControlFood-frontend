// src/components/Breadcrumbs.tsx
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

    const isMainPage = location.pathname === "/main-page";
    const containerClass = isMainPage ? "bg-black" : "bg-white";
    const textClass = isMainPage ? "text-white" : "text-gray-700";
    const navClass = isMainPage ? "my-4 px-4" : "my-4 px-4";

    return (
        <div className={`${containerClass} ${isMainPage ? 'm-0 p-3' : ''}`}>
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
                            Home
                        </Link>
                    </li>

                    {pathnames.map((value, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathnames.length - 1;

                        // Replace dashes with spaces and capitalize each word
                        const formattedValue = value
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        return (
                            <React.Fragment key={routeTo}>
                                <ChevronRightIcon className={`w-4 h-4 ${isMainPage ? "text-white" : "text-gray-500"}`} aria-hidden="true" />
                                <li>
                                    {isLast ? (
                                        <span className={`${
                                            isMainPage
                                                ? "bg-gray-700 text-white"
                                                : "bg-blue-100 text-blue-700"
                                        } px-3 py-1 rounded-md font-medium`}>
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
