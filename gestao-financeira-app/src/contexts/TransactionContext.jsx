import { createContext, useState, useContext, useMemo } from "react";
import { useEffect } from "react";
import { Api } from "../services/api";
import { AuthContext } from "./AuthContext";

export const TransactionContext = createContext({ 
    transactions: [],
    updateTransaction: () => {},
    deleteTransaction: () => {},
    adicionarTransacao: () => {},
    getBalance: 0,
    getTotalIncome: 0,
    getTotalExpenses: 0
});

const api = Api();

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    
    // Função para buscar transações
    const fetchTransactions = async () => {
        try {
            if (!user || !user.id) {
                console.log("Usuário não encontrado, não é possível buscar transações");
                return;
            }
            
            console.log("Buscando transações para o usuário:", user.id);
            const response = await api.get(`user/${user.id}/transactions`);
            
            // Verifica se a resposta tem a estrutura esperada (pode estar aninhada)
            const transactionsData = response.data.transactions || response.data;
            setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
            console.log('Dados carregados:', transactionsData);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        }
    };
    
    // Efeito que escuta mudanças na autenticação
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("Usuário autenticado, carregando transações...");
            fetchTransactions();
        } else {
            // Limpa as transações quando o usuário deslogar
            setTransactions([]);
        }
    }, [isAuthenticated, user]);

    // atualizar transações
    const updateTransaction = (updatedTransaction) => {
        setTransactions(transactions.map(tx => 
            tx.id === updatedTransaction.id ? updatedTransaction : tx
        ));
    };

    // deletar transações
    async function deleteTransaction(id) {
        try {
            await api.delete(`/transaction/${id}`);
            setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== id));
        } catch (error) {
           console.error("Erro ao excluir transação:", error); 
        }
    };

    // adicionar transações
    function adicionarTransacao(transacao) {
        // Adiciona a nova transação ao estado
        setTransactions((prevTransactions) => [...prevTransactions, transacao]);
    }

    // Cáuculos de saldo, total de receitas e despesas --------------------------------------------------------------
    
    const getBalance = useMemo(() => {
        if (!Array.isArray(transactions)) return 0;

        return transactions.reduce((acc, transaction) => {
            // Se for receita, adiciona; se for despesa, subtrai
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'RECEITA' ? acc + amount : acc - amount;
        }, 0);
    }, [transactions]);
    
    // const getBalance = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
    //     // Se for receita, adiciona; se for despesa, subtrai
    //     const amount = parseFloat(transaction.amount || 0);
    //     return transaction.transactionType === 'RECEITA' ? acc + amount : acc - amount;
    // }, 0) : 0;

    const getTotalIncome = useMemo(() => {
        if (!Array.isArray(transactions)) return 0;

        return transactions.reduce((acc, transaction) => {
            // Soma apenas as receitas
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'RECEITA' ? acc + amount : acc;
        }, 0);
    }, [transactions]);

    // const getTotalIncome = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
    //     // Soma apenas as receitas
    //     const amount = parseFloat(transaction.amount || 0);
    //     return transaction.transactionType === 'RECEITA' ? acc + amount : acc;
    // }, 0) : 0;

    const getTotalExpenses = useMemo(() => {
        if (!Array.isArray(transactions)) return 0;

        return transactions.reduce((acc, transaction) => {
            // Soma apenas as despesas
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'DESPESA' ? acc + amount : acc;
        }, 0);
    }, [transactions]);

    // const getTotalExpenses = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
    //     // Soma apenas as despesas
    //     const amount = parseFloat(transaction.amount || 0);
    //     return transaction.transactionType === 'DESPESA' ? acc + amount : acc;
    // }, 0) : 0;

    return (
        <TransactionContext.Provider value={{ 
            transactions,
            getBalance, 
            getTotalExpenses, 
            getTotalIncome,
            updateTransaction,
            deleteTransaction,
            fetchTransactions, // Exportando a função para permitir atualização manual
            adicionarTransacao
        }}>
            {children}
        </TransactionContext.Provider>
    );
}