import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Api, AUTH_EVENTS } from '../services/api';
import { toast } from 'react-toastify';

const api = Api();

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = ['/login', '/cadastro'];

// 1. Criar o Contexto
export const AuthContext = createContext({});

// 2. Criar o Provedor do Contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Para saber quando a verificação inicial terminou
    const navigate = useNavigate();
    const location = useLocation();
    
    // Escutar eventos de autenticação disparados pelo interceptador
    useEffect(() => {
        const handleTokenExpired = (event) => {
            console.log('Evento de token expirado recebido');
            
            // Limpar os dados do usuário
            setUser(null);
            setIsAuthenticated(false);
            
            
            if (event.detail?.message) {
                // Se você estiver usando React Toastify ou similar
                toast.info(event.detail.message);
                console.log(event.detail.message);
            }
            
            // Redirecionar para a página de login
            navigate('/login');
        };
        
        const handleNetworkError = (event) => {
            // Mostrar mensagem de erro de rede para o usuário
            if (event.detail?.message) {
                // Se você estiver usando React Toastify ou similar
                toast.error(event.detail.message);
                console.error(event.detail.message);
            }
        };
        
        // Adicionar listeners para os eventos
        window.addEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);
        window.addEventListener(AUTH_EVENTS.NETWORK_ERROR, handleNetworkError);
        
        // Cleanup: remover os listeners quando o componente for desmontado
        return () => {
            window.removeEventListener(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);
            window.removeEventListener(AUTH_EVENTS.NETWORK_ERROR, handleNetworkError);
        };
    }, [navigate]);
    
    // Roda uma vez quando a aplicação carrega para verificar se já existe um token
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        // Verifica se a rota atual é pública
        const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
        
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        } else {
            console.log('Nenhum token encontrado, usuário não autenticado');
            setUser(null);
            setIsAuthenticated(false);
            
            // Só redireciona para login se não estiver em uma rota pública
            if (!isPublicRoute) {
                console.log('Redirecionando para login por não estar em uma rota pública');
                navigate('/login'); 
            }
        }
        setLoading(false); // Finaliza o carregamento inicial
    }, [navigate, location.pathname]);    
    
    const login = async (email, password) => {
        try {
            // Primeiro limpa estados anteriores
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;            
            
            // Garante que salvamos primeiro no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('Login bem sucedido, token salvo e usuário definido');
            
            // Atualizamos os estados que vão desencadear as requisições de dados
            setUser(userData);
            setIsAuthenticated(true);
            
            // Navegamos para o dashboard após atualizar os estados
            navigate('/dashboard');
        } catch (error) {
            console.error("Erro no login:", error);
            // Lança o erro para que o componente de login possa tratá-lo
            throw error;
        }
    };

    const logout = () => {
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
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Criar o Hook customizado para facilitar o uso
export const useAuth = () => {
    return useContext(AuthContext);
};