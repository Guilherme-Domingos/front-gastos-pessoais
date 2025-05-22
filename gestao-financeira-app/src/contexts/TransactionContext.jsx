import { createContext, useState } from "react";

export const TransactionContext = createContext({ transactions: [], filtro: '', setFiltro: () => {} });

export function TransactionProvider({ children }) {
    const [filtro, setFiltro] = useState('');

    const transactions = [
        { id: 1, date: '2023-10-01', category: 'Alimentação', description: 'Supermercado', value: -150.00 },
        { id: 2, date: '2023-10-02', category: 'Salário', description: 'Salário Mensal', value: 3000.00 },
        { id: 3, date: '2023-10-03', category: 'Transporte', description: 'Gasolina', value: -100.00 },
        { id: 4, date: '2023-10-04', category: 'Lazer', description: 'Cinema', value: -50.00 },
        { id: 5, date: '2023-10-05', category: 'Saúde', description: 'Farmácia', value: -200.00 },
    ];

    return (
        <TransactionContext.Provider value={{ transactions, filtro, setFiltro }}>
            {children}
        </TransactionContext.Provider>
    );
}