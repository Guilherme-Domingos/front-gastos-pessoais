import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Dashboard } from '../pages/Dashboard/DashboardPage';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/receita/nova': 'Nova Receita',
  '/despesa/nova': 'Nova Despesa',
  '/perfil': 'Perfil',
  // Adicione outros caminhos e títulos conforme necessário
};

function LayoutWrapper() {
  const location = useLocation();
  // Pega o pathname até o primeiro segmento relevante
  const path = location.pathname === '/' ? '/' : location.pathname.split('/').slice(0, 2).join('/');
  const pageTitle = PAGE_TITLES[path] || 'Gestão Financeira';

  return (
    <DefaultLayout pageTitle={pageTitle}>
      <Outlet />
    </DefaultLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/cadastro' element={<SingUpPage />} />
      <Route path='/' element={<LayoutWrapper />}>
        <Route index element={<Dashboard />} />
        <Route path="receita/nova" element={<h1>Nova Receita</h1>} />
        <Route path="despesa/nova" element={<h1>Nova Despesa</h1>} />
        <Route path="perfil" element={<h1>Perfil</h1>} />
      </Route>
    </Routes>
  );
}