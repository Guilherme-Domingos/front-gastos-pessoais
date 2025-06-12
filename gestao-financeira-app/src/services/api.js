import axios from 'axios';

export function Api(){
    const api = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    api.interceptors.request.use(
        config => {
            // Aqui você pode adicionar lógica antes de enviar a requisição
            return config;
        },
        error => {
            // Aqui você pode lidar com erros de requisição
            return Promise.reject(error);
        }
    );

    return api;
}