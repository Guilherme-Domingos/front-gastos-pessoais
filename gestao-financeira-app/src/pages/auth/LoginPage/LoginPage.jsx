import styles from './LoginPage.module.css';
import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

function LoginPage() {  
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, } = useAuth();
  const navigate = useNavigate(); // Adicionando o hook useNavigate

  // Declaramos todos os hooks antes de qualquer retorno condicional
  
  useEffect(() => {
    // Verificar se o usuário já está autenticado ao carregar o componente
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuário já autenticado, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log("Tentando login com:", { email, password });
      // Usando a função login do AuthContext
      await login(email, password);
      // Não precisa redirecionar aqui, o AuthContext já faz isso
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      setError('Falha na autenticação. Verifique suas credenciais.');
    }
  };
  
  // Verificação de autenticação movida para depois de todos os hooks e definições de funções
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Bem-Vindo</h1>

      <div className={styles['form-box']}>
        <form onSubmit={handleLogin}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joao@gmail.com"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            value={password}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          <div className={styles.esqueci}>
            <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className={styles['botao-verde']}>Entrar</button>

          <div className={styles.cadastro}>
            <Link to="/cadastro">Cadastre-se</Link>
          </div>
        </form>
      </div>

      <button className={styles['botao-google']}>
        <img src="/download.png" alt="Google" />
        Entrar com o Google
      </button>
    </div>
  );
}

export default LoginPage;