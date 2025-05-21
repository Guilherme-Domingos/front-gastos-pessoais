import { Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Dashboard } from '../pages/Dashboard/DashboardPage';

function LayoutWrapper() {
    return (
        <DefaultLayout>
            <Outlet />
        </DefaultLayout>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<LayoutWrapper />}>
                <Route index element={<Dashboard />} />
                <Route path="receita/nova" element={<h1>Nova Receita</h1>} />
            </Route>
        </Routes>
    );
}