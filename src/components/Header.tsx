import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-4 bg-gradient-to-r from-red-600 to-orange-500 bg-opacity-90 text-white shadow-lg z-50 transition duration-300">
            <div className="text-2xl sm:text-3xl font-bold tracking-wide">
                ControlFood
            </div>
            <nav className="flex flex-col sm:flex-row mt-4 sm:mt-0">
                <Link
                    to="/register"
                    className="text-lg sm:text-xl font-semibold transition-colors duration-300 hover:text-yellow-400 sm:ml-6"
                >
                    Register
                </Link>
                <Link
                    to="/login"
                    className="text-lg sm:text-xl font-semibold transition-colors duration-300 hover:text-yellow-400 sm:ml-6 mt-2 sm:mt-0"
                >
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
