import React, { useState } from 'react';
import styles from './TransactionList.module.css';
import { Search } from 'lucide-react';
import { TransactionItem } from './TransactionItem';

export function TransactionList({ transactions = [] }) {
  const [search, setSearch] = useState('');

  const filtered = Array.isArray(transactions) ? transactions.filter(transaction => {
    const searchLower = search.toLowerCase();

    // Garante que todas as propriedades sejam strings e não null/undefined antes de chamar toLowerCase()
    const description = String(transaction.description || '');
    const date = String(transaction.date || '');

    return (
        description.toLowerCase().includes(searchLower) ||
        date.toLowerCase().includes(searchLower) 
    );
  }) : [];


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
          {/* <button className={styles.button}><Filter size={16} /></button>
          <button className={styles.button}><HelpCircle size={16} /></button> */}
        </div>
      </div>

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