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
        // Lógica antes de enviar a requisição
        return config;
    },
    error => {
        // Lidar com erros de requisição
        return Promise.reject(error);
    }
);

// Exportar a instância única
export const Api = () => api;