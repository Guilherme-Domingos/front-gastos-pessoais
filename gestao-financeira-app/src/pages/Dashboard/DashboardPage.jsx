import React, { useContext } from 'react';
import { Card } from '../../components/Card';
import { CreditCard, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './Dashboard.module.css';
import { TransactionList } from '../../components/TransactionList';
import { TransactionContext } from '../../contexts/TransactionContext';

export function Dashboard() {
  const { transactions } = useContext(TransactionContext);

  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>
        <Card
          title="Saldo do Mês"
          icon={<CreditCard size={20} />}
          value="R$ 2245.00"
        />
        <Card
          title="Total de Receitas"
          icon={<ArrowUp size={20} />}
          value="R$ 2500.00"
          valueColor={styles.positive}
        />
        <Card
          title="Total de Despesas"
          icon={<ArrowDown size={20} />}
          value="R$ 255.00"
          valueColor={styles.negative}
        />
      </div>
      <TransactionList transactions={transactions} />
    </div>  
  );
}