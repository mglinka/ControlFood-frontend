import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-center p-4 bg-gray-800 text-white">
            <p>&copy; {new Date().getFullYear()} Control Food. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
