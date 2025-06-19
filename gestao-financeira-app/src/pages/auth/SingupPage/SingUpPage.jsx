import './SingUpPage.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../../../services/api';
import { toast } from 'react-toastify';

const api = Api();

export default function SingUp() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está autenticado ao carregar o componente
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuário já autenticado, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Todos os campos são obrigatórios.');
      return false;
    }

    if (formData.senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido.');
      return false;
    }

    return true;
  };

  const handleSingUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Tentando cadastro com:", { 
        nome: formData.nome, 
        email: formData.email, 
        senha: formData.senha 
      });
      
      // Chame seu endpoint de API para registro
      const response = await api.post('/user', {
        name: formData.nome,
        email: formData.email,
        password: formData.senha
      });
      
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      
      // Tratamento de erro específico
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        if (error.response.status === 409) {
          setError('Este email já está em uso.');
        } else if (error.response.status === 400) {
          setError(error.response.data.message || 'Dados de cadastro inválidos.');
        } else {
          setError('Falha no cadastro. Por favor, tente novamente.');
        }
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Algo aconteceu na configuração da requisição
        setError('Erro ao processar o cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">Cadastre-se</h1>

      <div className="form-box">
        <form onSubmit={handleSingUp}>
          {error && <div className="error-message">{error}</div>}
          
          <label htmlFor="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            placeholder="Digite seu nome"
            value={formData.nome}
            onChange={handleChange}
            required 
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
            required 
          />

          <label htmlFor="senha">Senha (Min. 8 caracteres)</label>
          <input 
            type="password" 
            id="senha" 
            placeholder="Digite uma senha"
            value={formData.senha}
            onChange={handleChange}
            minLength={8}
            required 
          />

          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmarSenha" 
            placeholder="Confirme sua senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required 
          />

          <button 
            type="submit" 
            className="botao-verde" 
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar-se'}
          </button>

          <div className="login">
            <Link to="/login">Já sou cadastrado</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
