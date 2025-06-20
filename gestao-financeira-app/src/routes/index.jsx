import { Routes, Route, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Dashboard } from '../pages/Dashboard/DashboardPage';
import { NewRecipe } from '../pages/NewRecipe/NewRecipe';
import { NewExpense } from '../pages/NewExpense/NewExpense';
import { TransactionEdit } from '../pages/TransactionEdit/TransactionEdit';
import { TransactionDetails } from '../components/TransactionDetails';
import { ProtectedRoute } from './ProtectedRoute';
import { ProfilePage } from '../pages/profile/ProfilePage';

const PAGE_TITLES = {  '/dashboard': 'Dashboard',
  '/dashboard/receita/nova': 'Nova Receita',
  '/dashboard/despesa/nova': 'Nova Despesa',
  '/dashboard/perfil': 'Perfil',
  '/dashboard/transacao': 'Detalhes da Transação',
  '/dashboard/transacao/editar': 'Editar Transação',
};

function LayoutWrapper() {
  const location = useLocation();
  // Pega o pathname até o primeiro segmento relevante
  const path = location.pathname === '/dashboard' ? '/dashboard' : location.pathname.split('/').slice(0, 3).join('/');
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
      {/* Rotas públicas */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/cadastro' element={<SingUpPage />} />
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Navigate to="/dashboard" replace />} />
        <Route path='/dashboard' element={<LayoutWrapper />}>
          <Route index element={<Dashboard />} />
          <Route path="receita/nova" element={<NewRecipe />} />        
          <Route path="despesa/nova" element={<NewExpense/>} />
          <Route path="perfil" element={<ProfilePage/>} />
          <Route path="transacao/:id" element={<TransactionDetails />} />
          <Route path="transacao/:id/editar" element={<TransactionEdit />} />
        </Route>
      </Route>
    </Routes>
  );
}