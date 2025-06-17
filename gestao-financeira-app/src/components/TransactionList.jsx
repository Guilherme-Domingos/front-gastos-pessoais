import React, { useState, useContext, useEffect } from 'react';
import styles from './TransactionList.module.css';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { TransactionContext } from '../contexts/TransactionContext';

export function TransactionList() {
  const [search, setSearch] = useState('');
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  
  const { 
    filteredTransactions, 
    filterTransactionsByMonth, 
    clearMonthFilter,
    selectedMonth,
    selectedYear
  } = useContext(TransactionContext);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Gerar anos para o filtro (3 anos atrás até 2 anos à frente)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 2; i++) {
    years.push(i);
  }

  const filtered = Array.isArray(filteredTransactions) ? filteredTransactions.filter(transaction => {
    const searchLower = search.toLowerCase();

    // Garante que todas as propriedades sejam strings e não null/undefined antes de chamar toLowerCase()
    const description = String(transaction.description || '');
    const date = String(transaction.date || '');

    return (
        description.toLowerCase().includes(searchLower) ||
        date.toLowerCase().includes(searchLower) 
    );
  }) : [];

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data decrescente
  
  // Aplicar filtro quando o mês e o ano forem selecionados
  const handleApplyFilter = (year, month) => {
    if (year && month !== null) {
      filterTransactionsByMonth(year, month);
      setShowMonthFilter(false);
    }
  };

  // Limpar filtro
  const handleClearFilter = () => {
    clearMonthFilter();
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Histórico de Transações</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Search size={16} className={styles.icon} />
              <input
                type="text"
                placeholder="Buscar transação"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </form>
          </div>
          
          {/* Filtro aplicado - mostra o status */}
          {selectedMonth !== null && selectedYear !== null && (
            <div className={styles.activeFilter}>
              <span className={styles.filterBadge}>
                <Calendar size={14} /> {months[selectedMonth]} {selectedYear}
                <button 
                  className={styles.clearFilter} 
                  onClick={handleClearFilter}
                  title="Limpar filtro"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
          )}
          
          {/* Botão para abrir o filtro */}
          <button 
            className={styles.button} 
            onClick={() => setShowMonthFilter(!showMonthFilter)}
          >
            Filtrar por Mês <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Dropdown do filtro de mês */}
      {showMonthFilter && (
        <div className={styles.monthFilter}>
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label>Mês</label>
              <select 
                className={styles.select}
                defaultValue={selectedMonth !== null ? selectedMonth : ''}
                onChange={(e) => handleApplyFilter(
                  document.getElementById('year-filter').value, 
                  e.target.value !== '' ? parseInt(e.target.value) : null
                )}
              >
                <option value="">Selecione o mês</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Ano</label>
              <select 
                id="year-filter"
                className={styles.select}
                defaultValue={selectedYear || currentYear}
                onChange={(e) => handleApplyFilter(
                  e.target.value !== '' ? parseInt(e.target.value) : null,
                  document.querySelector('select').value !== '' ? 
                    parseInt(document.querySelector('select').value) : 
                    null
                )}
              >
                <option value="">Selecione o ano</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th className={styles.valueHeader}>Valor</th>
          </tr>
        </thead>
        <tbody>          
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="3" className={styles.noResults}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p>Sem transações encontradas</p>
                </div>
              </td>
            </tr>
          ) : (
            filtered.map(tx => (
              <TransactionItem key={tx.id} tx={tx} />
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}