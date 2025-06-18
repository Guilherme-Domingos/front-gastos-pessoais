import axios from 'axios';

// Criar uma única instância do Axios
const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            // Adicionar o token de autenticação ao cabeçalho da requisição
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Lidar com erros de requisição
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  // Se a resposta for bem-sucedida, apenas a retorna
  response => response,
  // Se ocorrer um erro, executa esta função
  error => {
    // Verifica se o erro é o 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido. Realizando logout...');
      // Limpa os dados de autenticação do armazenamento local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redireciona o usuário para a tela de login
      window.location.href = '/login';
    }
    // Para outros erros, apenas rejeita a promise
    return Promise.reject(error);
  }
);

// Exportar a instância única
export const Api = () => api;