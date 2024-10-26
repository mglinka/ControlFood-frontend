import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: '#343a40',
            color: '#ffffff',
        }}>
            <p>&copy; {new Date().getFullYear()} Controll Food. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
