import { createContext, useState } from "react";

export const TransactionContext = createContext({ 
    transactions: [], 
    filtro: '', 
    setFiltro: () => {},
    updateTransaction: () => {},
    deleteTransaction: () => {}
});

export function TransactionProvider({ children }) {
    const [filtro, setFiltro] = useState('');
    const [transactions, setTransactions] = useState([
        { id: 1, date: '2023-10-01', category: 'Alimentação', description: 'Supermercado', value: -150.00, type: 'despesa' },
        { id: 2, date: '2023-10-02', category: 'Salário', description: 'Salário Mensal', value: 3000.00, type: 'receita', sender: 'Mercadim' },
        { id: 3, date: '2023-10-03', category: 'Transporte', description: 'Gasolina', value: -100.00, type: 'despesa' },
        { id: 4, date: '2023-10-04', category: 'Lazer', description: 'Cinema', value: -50.00, type: 'despesa' },
        { id: 5, date: '2023-10-05', category: 'Saúde', description: 'Farmácia', value: -200.00, type: 'despesa' },
        { id: 6, date: '2023-10-05', category: 'Casa', description: 'Construção da garagem', value: -20000.00, type: 'despesa' },
    ]);

    const updateTransaction = (updatedTransaction) => {
        setTransactions(transactions.map(tx => 
            tx.id === updatedTransaction.id ? updatedTransaction : tx
        ));
    };

    const deleteTransaction = (id) => {
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    const getBalance = () => {
        return transactions.reduce((acc, transaction) => {
            return transaction.type === 'receita' ? acc + transaction.value : acc + transaction.value;
        }, 0);
    }

    const getTotalIncome = () => {
        return transactions.reduce((acc, transaction) => {
            return transaction.type === 'receita' ? acc + transaction.value : acc;
        }, 0);
    }

    const getTotalExpenses = () => {
        return transactions.reduce((acc, transaction) => {
            return transaction.type === 'despesa' ? acc + transaction.value : acc;
        }, 0);
    }

    return (
        <TransactionContext.Provider value={{ 
            transactions, 
            filtro, 
            getBalance, 
            getTotalExpenses, 
            getTotalIncome, 
            setFiltro,
            updateTransaction,
            deleteTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
}