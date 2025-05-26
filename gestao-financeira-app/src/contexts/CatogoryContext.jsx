import { createContext, useState } from "react";

export const CategoryContext = createContext({ categories: [], addCategory: () => {} });

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Alimentação' },
        { id: 2, name: 'Transporte' },
        { id: 3, name: 'Saúde' },
        { id: 4, name: 'Lazer' },
        { id: 5, name: 'Educação' },
        { id: 6, name: 'Outros' },
    ]);

    const addCategory = (name) => {
        if (!categories.some(cat => cat.name === name)) {
            setCategories([...categories, { id: Date.now(), name }]);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory }}>
            {children}
        </CategoryContext.Provider>
    );
}