import { createContext, useState } from "react";
import { useEffect } from "react";
import { Api } from "../services/api";

export const TransactionContext = createContext({ 
    transactions: [], 
    filtro: '', 
    setFiltro: () => {},
    updateTransaction: () => {},
    deleteTransaction: () => {}
});

const api = Api();

export function TransactionProvider({ children }) {
    const [filtro, setFiltro] = useState('');

    const [transactions, setTransactions] = useState([]);    
    
    useEffect(() => {
      async function fetchTransactions () {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.get(`user/${user.id}/transactions`);
            // Verifica se a resposta tem a estrutura esperada (pode estar aninhada)
            const transactionsData = response.data.transactions || response.data;
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            console.log('Dados carregados:', transactionsData);
        } catch (error) {
          console.error("Erro ao buscar transações:", error);
        }
      }
      fetchTransactions();
    }
    , []);

    const updateTransaction = (updatedTransaction) => {
        setTransactions(transactions.map(tx => 
            tx.id === updatedTransaction.id ? updatedTransaction : tx
        ));
    };

    async function deleteTransaction(id) {
        try {
            await api.delete(`/transaction/${id}`);
            setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== id));
        } catch (error) {
           console.error("Erro ao excluir transação:", error); 
        }
    };    
    
    const getBalance = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
        // Se for receita, adiciona; se for despesa, subtrai
        const amount = parseFloat(transaction.amount || 0);
        return transaction.transactionType === 'RECEITA' ? acc + amount : acc - amount;
    }, 0) : 0;

    const getTotalIncome = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
        // Soma apenas as receitas
        const amount = parseFloat(transaction.amount || 0);
        return transaction.transactionType === 'RECEITA' ? acc + amount : acc;
    }, 0) : 0;

    const getTotalExpenses = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
        // Soma apenas as despesas
        const amount = parseFloat(transaction.amount || 0);
        return transaction.transactionType === 'DESPESA' ? acc + amount : acc;
    }, 0) : 0;

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