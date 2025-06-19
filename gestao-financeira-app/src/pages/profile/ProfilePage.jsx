import { useState, useEffect, useContext } from "react";
import { Api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { CategoryChart } from "../../components/CategoryChart";
import { TransactionContext } from "../../contexts/TransactionContext";
import styles from "./ProfilePage.module.css";

export function ProfilePage() {
    const api = Api();
    const { user } = useContext(AuthContext);
    
    const [dadosReceitas, setDadosReceitas] = useState(null);
    const [dadosDespesas, setDadosDespesas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipoGrafico, setTipoGrafico] = useState('RECEITA'); // RECEITA ou DESPESA

    const fetchCategoryTotalData = async (tipo) => {
        if (!user || !user.id) {
            setError("Usuário não encontrado. Faça login novamente.");
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            console.log(`Buscando dados de ${tipo} para o usuário:`, user.id);
            const response = await api.get(`user/${user.id}/transactions/totals-by-category?type=${tipo}`);
            
            if (!response.data || !response.data.totals || response.data.totals.length === 0) {
                setError(`Nenhuma ${tipo.toLowerCase()} encontrada.`);
                return;
            }
            
            console.log(`Dados de ${tipo} por categoria:`, response.data.totals);
            
            if (tipo === "RECEITA") {
                setDadosReceitas(response.data.totals);
            } else {
                setDadosDespesas(response.data.totals);
            }
        } catch (error) {
            console.error(`Erro ao buscar dados de ${tipo}:`, error);
            setError(`Erro ao carregar dados de ${tipo.toLowerCase()}.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Carregar dados de receitas e despesas
        fetchCategoryTotalData("RECEITA");
        fetchCategoryTotalData("DESPESA");
    }, [user]);
    
    return (
        <div className={styles.profileContainer}>
            <h1>Análise Financeira</h1>
            
            <div className={styles.chartControls}>
                <button 
                    className={`${styles.chartButton} ${tipoGrafico === 'RECEITA' ? styles.active : ''}`} 
                    onClick={() => setTipoGrafico('RECEITA')}
                >
                    Receitas
                </button>
                <button 
                    className={`${styles.chartButton} ${tipoGrafico === 'DESPESA' ? styles.active : ''}`} 
                    onClick={() => setTipoGrafico('DESPESA')}
                >
                    Despesas
                </button>
            </div>
            
            <div className={styles.chartContainer}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <p>Carregando dados...</p>
                    </div>
                ) : error ? (
                    <div className={styles.errorContainer}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <h2>
                            {tipoGrafico === 'RECEITA' 
                                ? 'Distribuição de Receitas por Categoria' 
                                : 'Distribuição de Despesas por Categoria'}
                        </h2>
                        <CategoryChart
                            data={tipoGrafico === 'RECEITA' ? dadosReceitas : dadosDespesas}
                        />
                        
                        {/* Tabela com os dados */}
                        <div className={styles.tableContainer}>
                            <h3>Detalhamento por Categoria</h3>
                            <table className={styles.categoryTable}>
                                <thead>
                                    <tr>
                                        <th>Categoria</th>
                                        <th>Valor Total (R$)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(tipoGrafico === 'RECEITA' ? dadosReceitas : dadosDespesas)?.map((item) => (
                                        <tr key={item.categoryId}>
                                            <td>{item.categoryName}</td>
                                            <td className={styles.value}>
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}