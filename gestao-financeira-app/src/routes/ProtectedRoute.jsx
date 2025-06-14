// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Todos os hooks são chamados antes de qualquer retorno condicional
  
  // Se ainda está verificando o estado da autenticação, mostra um loader
  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de loading mais elaborado
  }

  // Se não está autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    console.log("Redirecionando para login - usuário não autenticado");
    return <Navigate to="/login" />;
  }

  // Se está autenticado, renderiza a página solicitada
  console.log("Usuário autenticado, permitindo acesso à rota protegida");
  return <Outlet />;
};