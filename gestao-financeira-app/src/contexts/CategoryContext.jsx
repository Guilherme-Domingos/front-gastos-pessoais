import { createContext, useEffect, useState } from "react";
import { Api } from "../services/api";

export const CategoryContext = createContext({ categories: [], addCategory: () => {} });

const api = Api();

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
          async function fetchCategories () {
            try {
              const user = JSON.parse(localStorage.getItem('user'));
              const response = await api.get(`/category/user/${user.id}`);
              // Verifica se a resposta tem a estrutura esperada (pode estar aninhada)
              const categoriesData = response.data.categories || response.data;
              console.log('Resposta da API:', categoriesData);
              setCategories(Array.isArray(categoriesData) ? categoriesData : []);
              console.log('Dados carregados:', categoriesData);
            } catch (error) {
              console.error("Erro ao buscar categorias:", error);
            }
          }
          fetchCategories();
        }
        , []);

    const addCategory = (name) => {
        if (!categories.some(cat => cat.name === name)) {
            setCategories([...categories, { id: Date.now(), name }]);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
}