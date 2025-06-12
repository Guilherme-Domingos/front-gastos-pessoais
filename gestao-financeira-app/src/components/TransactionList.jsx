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
    const category = String(transaction.category || '');

    return (
        description.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower) 
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
          {filtered.map(tx => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </tbody>
      </table>
    </section>
  );
}