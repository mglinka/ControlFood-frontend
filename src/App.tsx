
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AllergyProfilePage from "./pages/AllergyProfilePage";
import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import {AuthProvider} from "./utils/AuthContext.tsx";
import BarcodeScannerPage from "./pages/BarcodeScannerPage.tsx";
import SessionTimeout from "./utils/SessionTimeout.tsx";

function App() {




    return (

            <AuthProvider>
        <Router>
            <div className="relative">
                <Sidebar />
                <div className="pt-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<AllergyProfilePage accountId={"4c90f86a-0d82-4c51-b72c-80e20949a3b9"} />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/scanner" element={<BarcodeScannerPage />} />

                    </Routes>
                    <SessionTimeout/>


                </div>
            </div>
        </Router>
            </AuthProvider>

    );
}

export default App;
