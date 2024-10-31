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
import MyAccountPage from "./pages/MyAccountPage.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";
import AllergensPage from "./pages/AllergensPage.tsx";
import MainPage from "./pages/MainPage.tsx";

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
                                <Route path="/profile" element={<AllergyProfilePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/scanner" element={<BarcodeScannerPage />} />
                                <Route path="/my-account" element={<MyAccountPage />} />
                                <Route path="/create-product" element={<CreateProductPage />} />
                                <Route path="/create-allergen" element={<AllergensPage />} />
                                <Route path="/main-page" element={<MainPage />} />
                            </Routes>
                            <SessionTimeout/>
                        </div>
                    </div>
                </Router>
        </AuthProvider>
    );
}
export default App;
