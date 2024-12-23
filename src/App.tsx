import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
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
import Breadcrumbs from "./components/Breadcrumbs";
import AccountsPage from "./pages/AccountsPage.tsx";
import AccessLevelsPage from "./pages/AccessLevelsPage.tsx";
import SchemasPage from "./pages/SchemasPage.tsx";
import SpecialistProductsPage from "./pages/SpecialistProudctsPage.tsx";
import SafeProductsPage from "./pages/SafeProductsPage.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import NoAccessPage from "./pages/NoAccessPage.tsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {


    return (

        <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
                <Router>
                    <div className="relative">
                        <Sidebar />
                        <div className="pt-16">
                            <Breadcrumbs />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/profile" element={
                                    <ProtectedRoute requiredRoles={['ROLE_USER']}>
                                        <AllergyProfilePage/>
                                    </ProtectedRoute>
                                } />
                                <Route path="/products"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_USER']}>
                                               <ProductsPage />
                                           </ProtectedRoute>
                                       }
                                />
                                {/* Safe Products Route */}
                                <Route path="/safe-products"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_USER']}>
                                               <SafeProductsPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Specialist Products Route */}
                                <Route path="/products-specialist"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST']}>
                                               <SpecialistProductsPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Barcode Scanner Route */}
                                <Route path="/scanner"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST', 'ROLE_USER', 'ROLE_ADMIN']}>
                                               <BarcodeScannerPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* My Account Route */}
                                <Route path="/my-account"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST', 'ROLE_USER', 'ROLE_ADMIN']}>
                                               <MyAccountPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Create Product Route */}
                                <Route path="/create-product"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST']}>
                                               <CreateProductPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Create Allergen Route */}
                                <Route path="/create-allergen"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST']}>
                                               <AllergensPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Main Page Route */}
                                <Route path="/main-page"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST', 'ROLE_USER', 'ROLE_ADMIN']}>
                                               <MainPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Accounts Route */}
                                <Route path="/accounts"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                                               <AccountsPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Access Levels Route */}
                                <Route path="/access-levels"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                                               <AccessLevelsPage />
                                           </ProtectedRoute>
                                       }
                                />

                                {/* Schemas Route */}
                                <Route path="/schemas"
                                       element={
                                           <ProtectedRoute requiredRoles={['ROLE_SPECIALIST']}>
                                               <SchemasPage />
                                           </ProtectedRoute>
                                       }
                                />

                                <Route path="/no-access" element={<NoAccessPage />} />
                            </Routes>
                            <SessionTimeout/>
                        </div>
                    </div>
                </Router>
        </AuthProvider>
            </GoogleOAuthProvider>
    );
}
export default App;
