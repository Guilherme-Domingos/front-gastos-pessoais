import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import SingUpPage from '../pages/auth/SingupPage/SingUpPage';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Dashboard } from '../pages/Dashboard/DashboardPage';
import { NewRecipe } from '../pages/NewRecipe/NewRecipe';
import { NewExpense } from '../pages/NewExpense/NewExpense';
import { TransactionEdit } from '../pages/TransactionEdit/TransactionEdit';
import { TransactionDetails } from '../components/TransactionDetails';
import { useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';

const PAGE_TITLES = {  '/': 'Dashboard',
  '/dashboard/receita/nova': 'Nova Receita',
  '/dashboard/despesa/nova': 'Nova Despesa',
  '/dashboard/perfil': 'Perfil',
  '/dashboard/transacao': 'Detalhes da Transação',
  '/dashboard/transacao/editar': 'Editar Transação',
  // Adicione outros caminhos e títulos conforme necessário
};

function TransactionDetailsWrapper() {
  const { transactions, deleteTransaction } = useContext(TransactionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  const transaction = transactions.find(tx => String(tx.id) === id);

  if (!transaction) return <div>Transação não encontrada</div>;

  const handleEdit = () => {
    navigate(`/dashboard/transacao/${id}/editar`);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(parseInt(id));
      navigate('/');
    }
  };

  return <TransactionDetails transaction={transaction} onEdit={handleEdit} onDelete={handleDelete} />;
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
      <Route path='/dashboard' element={<LayoutWrapper />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard/receita/nova" element={<NewRecipe />} />        
        <Route path="despesa/nova" element={<NewExpense/>} />
        <Route path="perfil" element={<h1>Perfil</h1>} />
        <Route path="/dashboardtransacao/:id" element={<TransactionDetailsWrapper />} />
        <Route path="/dashboardtransacao/:id/editar" element={<TransactionEdit />} />
      </Route>
    </Routes>
  );
}