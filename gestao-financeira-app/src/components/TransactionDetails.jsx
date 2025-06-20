import { useState, useContext, useEffect } from 'react';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import styles from './TransactionDetails.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryContext } from '../contexts/CategoryContext';
import { TransactionContext } from '../contexts/TransactionContext';

export function TransactionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState('');
  const [remetente, setRemetente] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  
  const { categories } = useContext(CategoryContext);
  const { transactions, deleteTransaction } = useContext(TransactionContext);

  useEffect(() => {    
      
      const transaction = transactions.find(transaction => transaction.id === id);
      console.log('Transação encontrada:', transaction);
      
      if (!transaction) {
        alert('Transação não encontrada');
        navigate('/dashboard');
        return;
      }
      
      // Carregar dados da categoria pelo ID
      const category = categories.find(cat => cat.id === transaction.categoryId) || {};
      
      const {date, amount, description, transactionType} = transaction;
  
      // Formatar data para o formato YYYY-MM-DD com tratamento de erro
      const dataFormatted = new Date(date).toISOString().split('T')[0];
      
      setData(dataFormatted);
      setRemetente(transaction.sender || '');
      setCategoria(category.name);
      setValor(Math.abs(amount).toString());
      setDescricao(description || '');
      setTipo(transactionType);
    }, [id, transactions, navigate]);

  const isPositive = tipo === 'RECEITA';
  
  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
      navigate('/dashboard');
    }
  }

  const handleEdit = () => {
    navigate(`/dashboard/transacao/${id}/editar`);
  };

  const formattedamount = `${isPositive ? '+' : '-'}R$ ${Math.abs(valor).toFixed(2)}`;

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} />
        <span>Detalhes da Transação</span>
      </button>

      <h1 className={styles.title}>Detalhes da Transação</h1>

      <div className={styles.actions}>
        <button className={styles.editButton} onClick={handleEdit}>
          <Edit3 size={16} />
          <span>Editar</span>
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          <Trash2 size={16} />
          <span>Excluir</span>
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Data da Transação</span>
            <span className={styles.valueText}>{data}</span>
          </div>          
          <div className={styles.field}>
            <span className={styles.label}>Categoria</span>
            <span className={styles.valueText}>{categoria}</span>
          </div>
        </div>

        {remetente && (
          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>Remetente</span>
              <span className={styles.valueText}>{remetente}</span>
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
            <span className={tipo == "RECEITA" ? styles.valuePositive : styles.valueNegative}>
              {tipo}
            </span>
          </div>
        </div>

        <div className={styles.rowFull}>
          <span className={styles.label}>Descrição</span>
          <p className={styles.description}>{descricao || '-'}</p>
        </div>
      </div>
    </div>
  );
}