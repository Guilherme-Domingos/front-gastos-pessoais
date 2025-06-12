import React, { useState, useContext, useEffect } from 'react';
import styles from './TransactionEdit.module.css';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TransactionContext } from '../../contexts/TransactionContext';
import { CategoryContext } from '../../contexts/CatogoryContext';
import { CategoryModal } from '../../components/CategoryModal';

export function TransactionEdit() {
  const [data, setData] = useState('');
  const [remetente, setRemetente] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  console.log('ID da transação:', id);
  const { transactions, updateTransaction } = useContext(TransactionContext);
  const { categories, addCategory } = useContext(CategoryContext);

  // Carregar dados da transação
  useEffect(() => {
    const transaction = transactions.find(transaction => transaction.id === id);
    
    if (!transaction) {
      alert('Transação não encontrada');
      navigate('/dashboard');
      return;
    }

    setData(transaction.date);
    setRemetente(transaction.sender || '');
    setCategoria(transaction.category);
    setValor(Math.abs(transaction.amount).toString());
    setDescricao(transaction.description || '');
    setTipo(transaction.transactionType || 'RECEITA');
  }, [id, transactions, navigate]);

  const handleSaveCategory = (name) => {
    addCategory && addCategory(name);
    setCategoria(name);
  };

  const salvarAlteracoes = () => {
    if (!data || !categoria || !valor) {
      alert('Por favor, preencha os campos obrigatórios: Data, Categoria e Valor');
      return;
    }

    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico)) {
      alert('Por favor, insira um valor válido');
      return;
    }

    const transactionUpdated = {
      id: id,
      date: data,
      category: categoria,
      description: descricao,
      amount: tipo === 'RECEITA' ? valorNumerico : -valorNumerico,
      transactionType: tipo,
      sender: tipo === 'RECEITA' ? remetente : undefined
    };

    updateTransaction(transactionUpdated);
    alert('Transação atualizada com sucesso!');
    navigate(`/dashboard/transacao/${id}`);
  };

  const cancelar = () => {
    navigate(`/dashboard/transacao/${id}`);
  };

  // Renderização condicional para campos específicos de receita
  const isReceita = tipo === 'RECEITA';

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.backButton}
        onClick={() => navigate(`/dashboard/transacao/${id}`)}
      >
        <ArrowLeft size={16} />
        <span>Voltar para Detalhes</span>
      </button>

      <div className={styles.card}>
        <h1 className={styles.heading}>Editar Transação</h1>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className={styles.input}
              enable
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Data</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className={styles.input}
            />
          </div>

          {isReceita && (
            <div className={styles.field}>
              <label className={styles.label}>Remetente</label>
              <input
                type="text"
                placeholder="Ex: Empresa XYZ"
                value={remetente}
                onChange={e => setRemetente(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Categoria</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione...</option>
                {categories && categories.map(cat =>
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                )}
              </select>
              <button
                type="button"
                className={styles.buttonSecondary}
                style={{ padding: '0.25rem 0.5rem', height: '2.2rem', display: 'flex', alignItems: 'center' }}
                onClick={() => setModalOpen(true)}
                title="Adicionar categoria"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={valor}
              onChange={e => setValor(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.fieldFull}>
          <label className={styles.label}>Descrição (opcional)</label>
          <textarea
            rows={4}
            placeholder="Adicione uma descrição para esta transação"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.buttonSecondary} onClick={cancelar}>Cancelar</button>
          <button 
            className={isReceita ? styles.buttonPrimary : styles.buttonNegative} 
            onClick={salvarAlteracoes}
          >
            Salvar Alterações
          </button>
        </div>

        {modalOpen && (
          <CategoryModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveCategory}
          />
        )}
      </div>
    </div>
  );
}
