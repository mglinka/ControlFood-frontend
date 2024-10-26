import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AllergyProfilePage from "./pages/AllergyProfilePage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";
import BarcodeScanner from "react-qr-barcode-scanner";

function App() {
    const [data, setData] = useState<string>("");



    return (
        <>
            <BarcodeScanner
                width={500}
                height={500}
                onUpdate={(_err, result) => {
                    if (result) setData(result.getText());
                }}
            />
            <p>Result: {data}</p>
        <Router>
            <div className="relative">
                <Sidebar />
                <div className="pt-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<AllergyProfilePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
            </>
    );
}

export default App;
