import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';

export default function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/cadastro" element={<SingUpPage />} />
        </Routes>
        </BrowserRouter>
    );
    }