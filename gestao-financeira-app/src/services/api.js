import axios from 'axios';

// Criar uma única instância do Axios
const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Evento personalizado para comunicação com o AuthContext
export const AUTH_EVENTS = {
  TOKEN_EXPIRED: 'token_expired',
  NETWORK_ERROR: 'network_error'
};

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
        console.error('Erro na requisição:', error);
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
      console.log('Token expirado ou inválido.');
      
      // Disparar evento para o AuthContext lidar com o logout
      const event = new CustomEvent(AUTH_EVENTS.TOKEN_EXPIRED, {
        detail: { message: 'Sua sessão expirou. Por favor, faça login novamente.' }
      });
      window.dispatchEvent(event);
      
      // Ainda remove o token do localStorage para garantir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Se for erro de rede ou servidor indisponível
    else if (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500)) {
      // Disparar evento para erros de rede
      const event = new CustomEvent(AUTH_EVENTS.NETWORK_ERROR, {
        detail: { message: 'Não foi possível conectar ao servidor. Verifique sua conexão.' }
      });
      window.dispatchEvent(event);
    }
    
    // Para todos os erros, rejeita a promise
    return Promise.reject(error);
  }
);

// Exportar a instância única
export const Api = () => api;