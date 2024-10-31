import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-4 bg-gradient-to-r from-red-600 to-orange-500 bg-opacity-90 text-white shadow-lg z-50 transition duration-300">
            <div className="text-2xl md:text-3xl font-bold tracking-wide">
                ControlFood
            </div>
            <nav className="flex flex-col md:flex-row md:items-center md:space-x-6">
                <Link to="/register" className="text-lg md:text-xl font-semibold transition-colors duration-300 hover:text-yellow-400">
                    Register
                </Link>
                <Link to="/login" className="text-lg md:text-xl font-semibold transition-colors duration-300 hover:text-yellow-400">
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
