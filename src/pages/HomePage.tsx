import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocalImage from "../components/LocalImage.tsx";
import AppInfo from "../components/AppInfo.tsx";


const HomePage: React.FC = () => {
    return (
        <div>
            <Header />

            <LocalImage>
               <AppInfo/>
            </LocalImage>

            <Footer />
        </div>
    );
};

export default HomePage;
