import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../services/api';

const api = Api();

// 1. Criar o Contexto
export const AuthContext = createContext({});

// 2. Criar o Provedor do Contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Para saber quando a verificação inicial terminou
    const navigate = useNavigate();
      // Roda uma vez quando a aplicação carrega para verificar se já existe um token
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false); // Finaliza o carregamento inicial
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            navigate('/dashboard');
        } catch (error) {
            console.error("Erro no login:", error);
            // Lança o erro para que o componente de login possa tratá-lo
            throw error;
        }
    };

    const logout = () => {        // Opcional: Chamar a rota de logout do backend se houver alguma lógica lá
        // api.post('/auth/logout'); 
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        
        navigate('/login');
    };

    // O valor fornecido para os componentes filhos
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Criar o Hook customizado para facilitar o uso
export const useAuth = () => {
    return useContext(AuthContext);
};