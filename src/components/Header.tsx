import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-10 py-4 bg-gradient-to-r from-red-600 to-orange-500 bg-opacity-80 text-white shadow-lg z-50 transition duration-300">
            <div className="text-3xl font-bold tracking-wide">
                ControlFood
            </div>
            <nav className="flex">
                <Link to="/register" className="ml-6 text-xl font-semibold transition-colors duration-300 hover:text-yellow-400">
                    Register
                </Link>
                <Link to="/login" className="ml-6 text-xl font-semibold transition-colors duration-300 hover:text-yellow-400">
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
