import { createContext, useState, useContext, useMemo } from "react";
import { useEffect } from "react";
import { Api } from "../services/api";
import { AuthContext } from "./AuthContext";

export const TransactionContext = createContext({ 
    transactions: [],
    filteredTransactions: [], // Transações filtradas por mês
    updateTransaction: () => {},
    deleteTransaction: () => {},
    adicionarTransacao: () => {},
    fetchTransactionsByMonth: () => {}, // Nova função para filtrar por mês
    clearMonthFilter: () => {}, // Nova função para limpar o filtro
    selectedMonth: null, // Mês selecionado para filtro
    selectedYear: null, // Ano selecionado para filtro
    getBalance: 0,
    getTotalIncome: 0,
    getTotalExpenses: 0
});

const api = Api();

export function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]); // Estado para transações filtradas
    const [selectedMonth, setSelectedMonth] = useState(null); // Estado para mês selecionado (0-11)
    const [selectedYear, setSelectedYear] = useState(null); // Estado para ano selecionado
    const { isAuthenticated, user } = useContext(AuthContext);
    
    // Função para buscar todas as transações
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
            const transactionsList = Array.isArray(transactionsData) ? transactionsData : [];
            setTransactions(transactionsList);
            setFilteredTransactions(transactionsList); // Inicialmente, as transações filtradas são iguais a todas
            console.log('Dados carregados:', transactionsData);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        }
    };

    // Função para buscar transações filtradas por mês e ano do servidor
    // Esta função realiza uma chamada à API para obter dados filtrados
    const fetchTransactionsByMonth = async (year, month) =>{
        try {
            if (!user || !user.id) {
                console.log("Usuário não encontrado, não é possível buscar transações");
                return;
            }

            if (year === null || month === null) {
                clearMonthFilter();
                return;
            }
            
            console.log(`Buscando transações de ${month+1}/${year} para o usuário:`, user.id);
            const response = await api.get(`user/${user.id}/transactions/${year}/${month+1}`);
            console.log('Resposta da API (Mensal):', response.data);
            
            // Verifica se a resposta tem a estrutura esperada (pode estar aninhada)
            const transactionsData = response.data.transactions || response.data;
            const filteredList = Array.isArray(transactionsData) ? transactionsData : [];
            setFilteredTransactions(filteredList);
            
            // Atualiza os estados de filtro
            setSelectedMonth(month);
            setSelectedYear(year);
            
            console.log('Dados filtrados carregados:', filteredList);
            return filteredList;
        } catch (error) {
            console.error("Erro ao buscar transações por mês:", error);
            return [];
        }
    };
    
    // Limpa o filtro de mês e mostra todas as transações novamente
    const clearMonthFilter = () => {
        setFilteredTransactions(transactions);
        setSelectedMonth(null);
        setSelectedYear(null);
    };
    
    // Efeito que escuta mudanças na autenticação
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("Usuário autenticado, carregando transações...");
            fetchTransactions();
        } else {
            // Limpa as transações quando o usuário deslogar
            setTransactions([]);
            setFilteredTransactions([]);
        }
    }, [isAuthenticated, user]);   
    

    // atualizar transações com tratamento de erro
    const updateTransaction = (updatedTransaction) => {
        // Usar o padrão funcional para garantir que estamos trabalhando com o estado mais recente
        setTransactions(prevTransactions => 
            prevTransactions.map(tx => {
                if (tx.id === updatedTransaction.id) {
                    // Mesclar as propriedades para preservar campos que possam não estar no objeto atualizado
                    return { ...tx, ...updatedTransaction };
                }
                return tx;
            })
        );
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

    // Cálculos de saldo, receitas e despesas baseados nas transações filtradas
    const getBalance = useMemo(() => {
        if (!Array.isArray(filteredTransactions)) return 0;

        return filteredTransactions.reduce((acc, transaction) => {
            // Se for receita, adiciona; se for despesa, subtrai
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'RECEITA' ? acc + amount : acc - amount;
        }, 0);
    }, [filteredTransactions]);
    
    const getTotalIncome = useMemo(() => {
        if (!Array.isArray(filteredTransactions)) return 0;

        return filteredTransactions.reduce((acc, transaction) => {
            // Soma apenas as receitas
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'RECEITA' ? acc + amount : acc;
        }, 0);
    }, [filteredTransactions]);

    const getTotalExpenses = useMemo(() => {
        if (!Array.isArray(filteredTransactions)) return 0;

        return filteredTransactions.reduce((acc, transaction) => {
            // Soma apenas as despesas
            const amount = parseFloat(transaction.amount || 0);
            return transaction.transactionType === 'DESPESA' ? acc + amount : acc;
        }, 0);
    }, [filteredTransactions]);

    return (
        <TransactionContext.Provider value={{ 
            transactions,
            filteredTransactions,
            fetchTransactionsByMonth,
            clearMonthFilter,
            selectedMonth,
            selectedYear,
            getBalance, 
            getTotalExpenses, 
            getTotalIncome,
            updateTransaction,
            deleteTransaction,
            fetchTransactions,
            adicionarTransacao
        }}>
            {children}
        </TransactionContext.Provider>
    );
}