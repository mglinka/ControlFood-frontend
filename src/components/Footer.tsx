import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Controll Food. All rights reserved.</p>
        </footer>
    );
};

const styles = {
    footer: {
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#343a40',
        color: '#ffffff',
    },
};

export default Footer;
