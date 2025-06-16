import {useContext} from 'react';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import styles from './TransactionDetails.module.css';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../contexts/CategoryContext';

/**
 * Props:
 * - transaction: { date, category, description, amount, transactionType, sender? }
 * - onBack: () => void
 * - onEdit: () => void
 * - onDelete: () => void
 */
export function TransactionDetails({ transaction, onEdit, onDelete }) {
  const { categories } = useContext(CategoryContext);
  const navigate = useNavigate();

  const { date, categoryId, description, amount, transactionType, sender } = transaction;
  const formattedDate = date.slice(0, 10).split('-').reverse().join('/');

  const isPositive = transactionType === 'RECEITA';
  console.log('Transaction Details:', transaction);
  
  // Encontrar a categoria pelo ID
  const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'Categoria não encontrada';
  
  const formattedamount = `${isPositive ? '+' : '-'}R$ ${Math.abs(amount).toFixed(2)}`;

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} />
        <span>Detalhes da Transação</span>
      </button>

      <h1 className={styles.title}>Detalhes da Transação</h1>

      <div className={styles.actions}>
        <button className={styles.editButton} onClick={onEdit}>
          <Edit3 size={16} />
          <span>Editar</span>
        </button>
        <button className={styles.deleteButton} onClick={onDelete}>
          <Trash2 size={16} />
          <span>Excluir</span>
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Data da Transação</span>
            <span className={styles.valueText}>{formattedDate}</span>
          </div>          
          <div className={styles.field}>
            <span className={styles.label}>Categoria</span>
            <span className={styles.valueText}>{categoryName}</span>
          </div>
        </div>

        {sender && (
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Remetente</span>
              <span className={styles.valueText}>{sender}</span>
            </div>
          </div>
        )}

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Valor</span>
            <span className={isPositive ? styles.valuePositive : styles.valueNegative}>
              {formattedamount}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Tipo</span>
            <span className={transactionType == "RECEITA" ? styles.valuePositive : styles.valueNegative}>
              {transactionType}
            </span>
          </div>
        </div>

        <div className={styles.rowFull}>
          <span className={styles.label}>Descrição</span>
          <p className={styles.description}>{description || '-'}</p>
        </div>
      </div>
    </div>
  );
}