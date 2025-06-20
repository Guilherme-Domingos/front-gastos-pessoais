import React, { useEffect, useState, useContext } from 'react';
import { TransactionContext } from '../contexts/TransactionContext';
import { AuthContext } from '../contexts/AuthContext';
import { Api } from '../services/api';
import styles from './MonthlyGoalProgressiveBar.module.css';

export function MonthlyGoalProgressiveBar() {
  const api = Api();
  const { fetchTransactionsByMonth, getTotalExpenses } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const [metasMensais, setMetasMensais] = useState([]);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar as metas mensais do usuário
  const fetchMonthlyGoals = async () => {
    if (!user || !user.id) {
      setError("Usuário não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Buscando metas mensais para o usuário:`, user.id);
      const response = await api.get(`/monthly-goals/${user.id}`);
      
      if (!response.data || !response.data.data) {
        setError("Metas mensais não encontradas.");
        setLoading(false);
        return;
      }

      const { monthlyGoals } = response.data.data;
      const userMonthlyGoals = Array.isArray(monthlyGoals) ? monthlyGoals : [];
      
      console.log("Metas mensais:", userMonthlyGoals);
      setMetasMensais(userMonthlyGoals);
      
      // Selecionar a primeira meta por padrão se existir
      if (userMonthlyGoals.length > 0) {
        handleSelectGoal(userMonthlyGoals[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao buscar metas mensais:", error);
      setError("Erro ao carregar metas mensais.");
      setLoading(false);
    }
  };

  // Efeito para carregar metas quando o componente montar
  useEffect(() => {
    fetchMonthlyGoals();
  }, [user]);

  // Função para selecionar uma meta e filtrar transações
  const handleSelectGoal = (goalId) => {
    // Converter para número se for string
    const id = typeof goalId === 'string' ? parseInt(goalId, 10) : goalId;
    
    const meta = metasMensais.find(meta => meta.id === id);
    if (meta) {
      console.log("Meta selecionada:", meta);
      setMetaSelecionada(meta);
      
      // Filtrar transações pelo mês e ano da meta selecionada
      // API usa mês 1-12, mas JavaScript usa 0-11, por isso subtraímos 1
      fetchTransactionsByMonth(meta.ano, meta.mes - 1);
    }
    setLoading(false);
  };

  // Formatador para valores monetários
  const fmt = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  // Array com nomes dos meses
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Calcular os valores para a barra de progresso
  const valorLimite = metaSelecionada?.valorLimite || 0;
  const valorGasto = getTotalExpenses || 0;
  const porcentagem = valorLimite > 0 ? Math.round((valorGasto / valorLimite) * 100) : 0;
  const porcentagemLimitada = Math.min(porcentagem, 100); // Para a largura da barra
  const corBarra = porcentagem > 100 ? styles.barRed : styles.barGreen;

  // Exibir mensagem de carregamento
  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando metas mensais...</p>
      </div>
    );
  }

  // Exibir mensagem quando não há metas
  if (metasMensais.length === 0) {
    return (
      <div className={styles.container}>
        <p>Você ainda não possui metas mensais cadastradas.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Meta de despesas mensais
        </h3>
      </div>

    {metasMensais.length > 1 && (
      <div className={styles.selectWrapper}>
        <select
          value={metaSelecionada?.id || ""}
          onChange={(e) => handleSelectGoal(e.target.value)}
          className={styles.metaSelect}
        >
          <option value="">Selecione...</option>
          {metasMensais.map((meta) => (
            <option key={meta.id} value={meta.id}>
              {meta.mes && meta.ano
                ? `${meses[meta.mes - 1]} de ${meta.ano}`
                : `Meta: ${fmt.format(meta.valorLimite)}`}
            </option>
          ))}
        </select>
      </div>
    )}


      <div className={styles.progressBackground}>
        <div
          className={`${styles.progressBar} ${corBarra}`}
          style={{ width: `${porcentagemLimitada}%` }}
        />
      </div>
      
      <div className={styles.footer}>
        <span>{porcentagem}%</span>
        <span>
          {fmt.format(valorGasto)} / {fmt.format(valorLimite)}
        </span>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
