import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalImage from "../components/LocalImage.tsx";
import AppInfo from "../components/AppInfo.tsx";

const HomePage: React.FC = () => {
    return (
        <div style={styles.container}>
            <Header />

            <LocalImage>
               <AppInfo/>
            </LocalImage>

            <Footer />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Make sure the container takes at least full viewport height
    },
    main: {
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        flex: 1, // Allow main to grow and push footer down
    },
    title: {
        fontSize: '2.5rem',
        color: '#343a40',
    },
    description: {
        fontSize: '1.2rem',
        color: '#6c757d',
    },
    ctaContainer: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
    },
    ctaTitle: {
        fontSize: '1.8rem',
        color: '#495057',
    },
    ctaText: {
        fontSize: '1rem',
        color: '#6c757d',
    },
    ctaButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '1rem',
    }
};

export default HomePage;
