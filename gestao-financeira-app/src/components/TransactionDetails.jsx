import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import styles from './TransactionDetails.module.css';
import { useNavigate } from 'react-router-dom';

/**
 * Props:
 * - transaction: { date, category, description, value, type, sender? }
 * - onBack: () => void
 * - onEdit: () => void
 * - onDelete: () => void
 */
export function TransactionDetails({ transaction, onEdit, onDelete }) {
  const navigate = useNavigate();

  const { date, category, description, value, type, sender } = transaction;
  const isPositive = value >= 0;
  const formattedValue = `${isPositive ? '+' : '-'}R$ ${Math.abs(value).toFixed(2)}`;

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
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
            <span className={styles.valueText}>{date}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Categoria</span>
            <span className={styles.valueText}>{category}</span>
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
              {formattedValue}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Tipo</span>
            <span className={value > 0 ? styles.valuePositive : styles.valueNegative}>
              {value > 0 ? 'Receita' : 'Despesa'}
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