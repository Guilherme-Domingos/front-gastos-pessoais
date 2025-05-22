import React, { useState, useMemo } from 'react';
import styles from './TransactionList.module.css';
import { Search, Filter, HelpCircle } from 'lucide-react';
import { TransactionItem } from './TransactionItem';

export function TransactionList({ transactions }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    transactions.filter(tx =>
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase())
    ),
  [search, transactions]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Histórico de Transações</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.icon} />
            <input
              type="text"
              placeholder="Buscar transação"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {/* <button className={styles.button}><Filter size={16} /></button>
          <button className={styles.button}><HelpCircle size={16} /></button> */}
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
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