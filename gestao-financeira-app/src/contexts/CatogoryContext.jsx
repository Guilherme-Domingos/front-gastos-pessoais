import { createContext, useState } from "react";

export const TransactionContext = createContext({ categories: [] });

export function CategoryProvider({ children }) {

    const categories = [
        { id: 1, 'name': 'Alimentação' },
        { id: 2, 'name': 'Transporte' },
        { id: 3, 'name': 'Saúde' },
        { id: 4, 'name': 'Lazer' },
        { id: 5, 'name': 'Educação' },
        { id: 6, 'name': 'Outros' },
    ];

    return (
        <CategoryProvider.Provider value={{ categories }}>
            {children}
        </CategoryProvider.Provider>
    );
}