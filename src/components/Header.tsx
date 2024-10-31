import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-4 bg-gradient-to-r from-red-600 to-orange-500 bg-opacity-80 text-white shadow-lg z-50 transition duration-300 md:px-10">
            <div className="text-3xl font-bold tracking-wide">
                ControlFood
            </div>
            <div className="md:hidden">
                <button onClick={toggleMenu} className="text-2xl focus:outline-none">
                    {isMenuOpen ? '✖' : '☰'} {/* Hamburger menu icon */}
                </button>
            </div>
            <nav className={`flex-col md:flex md:flex-row md:items-center md:static absolute w-full md:w-auto bg-gradient-to-r from-red-600 to-orange-500 md:bg-transparent transition-all duration-300 ${isMenuOpen ? 'top-16' : 'top-[-200px]'}`}>
                <Link to="/register" className="block md:ml-6 text-xl font-semibold transition-colors duration-300 hover:text-yellow-400 py-2 md:py-0">
                    Register
                </Link>
                <Link to="/login" className="block md:ml-6 text-xl font-semibold transition-colors duration-300 hover:text-yellow-400 py-2 md:py-0">
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;
