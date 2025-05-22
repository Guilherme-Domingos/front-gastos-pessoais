import React from 'react';
import styles from './TransactionList.module.css';
import { useNavigate } from 'react-router-dom';

export function TransactionItem({ tx }) {
  const colorClass = tx.value >= 0 ? styles.positive : styles.negative;
  const formatted = `${tx.value >= 0 ? '+' : '-'}R$ ${Math.abs(tx.value).toFixed(2)}`;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/transacao/${tx.id}`);
  };

  return (
    <tr
      className={styles.row}
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleClick(); }}
    >
      <td>{tx.date}</td>
      <td>{tx.category}</td>
      <td>{tx.description || '-'}</td>
      <td className={colorClass}>{formatted}</td>
    </tr>
  );
}