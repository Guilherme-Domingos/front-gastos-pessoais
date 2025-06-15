import React, { useContext } from 'react';
import { Card } from '../../components/Card';
import { CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './Dashboard.module.css';
import { TransactionList } from '../../components/TransactionList';
import { TransactionContext } from '../../contexts/TransactionContext';

export function Dashboard() {
  const { transactions, getBalance, getTotalIncome, getTotalExpenses } = useContext(TransactionContext);

  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>        
        <Card
          title="Saldo total"
          icon={<CreditCard size={20} />}
          value={`R$ ${getBalance.toFixed(2)}`}
        />
        <Card
          title="Total de Receitas"
          icon={<ArrowUp size={20} />}
          value={`R$ ${getTotalIncome.toFixed(2)}`}
          valueColor={styles.positive}
        />
        <Card
          title="Total de Despesas"
          icon={<ArrowDown size={20} />}
          value={`R$ ${getTotalExpenses.toFixed(2)}`}
          valueColor={styles.negative}
        />
      </div>
      <TransactionList transactions={transactions} />
    </div>  
  );
}