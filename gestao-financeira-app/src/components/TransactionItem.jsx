import React from 'react';
import styles from './TransactionList.module.css';
import { useNavigate } from 'react-router-dom';

export function TransactionItem({ tx }) {
  // Usar amount em vez de value
  const amount = parseFloat(tx.amount || 0);
  // Para despesas, consideramos negativo (para coloração)
  const isNegative = tx.transactionType === 'DESPESA';
  const colorClass = isNegative ? styles.valueNegative : styles.valuePositive;
  const formatted = `${isNegative ? '-' : '+'}R$ ${Math.abs(amount).toFixed(2)}`;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/transacao/${tx.id}`);
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
      <td>{tx.description || '-'}</td>
      <td className={colorClass}>{formatted}</td>
    </tr>
  );
}