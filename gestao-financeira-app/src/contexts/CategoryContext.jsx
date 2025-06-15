import { createContext, useEffect, useState, useContext } from "react";
import { Api } from "../services/api";
import { AuthContext } from "./AuthContext";

export const CategoryContext = createContext({ 
  categories: [],
  adicionarCategoria: () => {} 
});

const api = Api();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    
    // Função para buscar categorias
    const fetchCategories = async () => {
        try {
            if (!user || !user.id) {
                console.log("Usuário não encontrado, não é possível buscar categorias");
                return;
            }
            
            console.log("Buscando categorias para o usuário:", user.id);
            const response = await api.get(`/category/user/${user.id}`);
            
            // Verifica se a resposta tem a estrutura esperada (pode estar aninhada)
            const categoriesData = response.data.categories || response.data;
            console.log('Resposta da API:', categoriesData);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            console.log('Dados de categorias carregados:', categoriesData);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    // Efeito que escuta mudanças na autenticação
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("Usuário autenticado, carregando categorias...");
            fetchCategories();
        } else {
            // Limpa as categorias quando o usuário deslogar
            setCategories([]);
        }
    }, [isAuthenticated, user]);

    function adicionarCategoria(categoria) {
        // Adiciona a nova categoria ao estado
        setCategories((prevCategories) => [...prevCategories, categoria]);
    }

    return (
        <CategoryContext.Provider value={{
          categories, 
          fetchCategories,
          adicionarCategoria
        }}>
            {children}
        </CategoryContext.Provider>
    );
}