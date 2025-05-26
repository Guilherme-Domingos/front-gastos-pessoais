import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Dashboard } from '../pages/Dashboard/DashboardPage';
import { NewRecipe } from '../pages/NewRecipe/NewRecipe';
import { NewExpense } from '../pages/NewExpense/NewExpense';
import { TransactionDetails } from '../components/TransactionDetails';
import { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/receita/nova': 'Nova Receita',
  '/despesa/nova': 'Nova Despesa',
  '/perfil': 'Perfil',
  '/transacao': 'Detalhes da Transação',
  // Adicione outros caminhos e títulos conforme necessário
};

function TransactionDetailsWrapper() {
  const { transactions } = useContext(TransactionContext);
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const transaction = transactions.find(tx => String(tx.id) === id);

  if (!transaction) return <div>Transação não encontrada</div>;

  return <TransactionDetails transaction={transaction} />;
}

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
        <Route path="receita/nova" element={<NewRecipe />} />
        <Route path="despesa/nova" element={<NewExpense/>} />
        <Route path="perfil" element={<h1>Perfil</h1>} />
        <Route path="transacao/:id" element={<TransactionDetailsWrapper />} />
      </Route>
    </Routes>
  );
}