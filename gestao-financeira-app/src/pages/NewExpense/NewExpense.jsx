import React, { useState, useContext } from 'react';
import styles from './NewExpense.module.css';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../../contexts/CategoryContext';
import { CategoryModal } from '../../components/CategoryModal';
import { TransactionContext } from '../../contexts/TransactionContext';
import { Api } from '../../services/api';

export function NewExpense() {
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { categories, addCategory } = useContext(CategoryContext);
  const { adicionarTransacao } = useContext(TransactionContext);

  const limparCampos = () => {
    setData('');
    setCategoria('');
    setValor('');
    setDescricao('');
  };

const registrar = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Você precisa estar logado para registrar uma despesa.');
        return;
    }

    const novaDespesa = {
        amount: parseFloat(valor),
        description: descricao,
        date: new Date(data).toISOString(), // Formato ISO 8601
        type: 'DESPESA',
        userId: user.id, // ID do usuário logado
        categoryId: parseInt(categoria) // Garanta que a categoria seja um número, se necessário
    };

    try {
        const api = Api();
        const response = await api.post('/transaction', novaDespesa);
        const {data} = response.data;
        alert('Receita registrada!');
        adicionarTransacao({id: data, ...novaDespesa}); // Atualiza o estado global
        navigate('/dashboard');
    } catch (error) {
        console.error('Erro ao registrar despesa:', error);
        alert('Falha ao registrar a despesa.');
    }
};

  const handleSaveCategory = (name) => {
    addCategory && addCategory(name);
    setCategoria(name);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.backButton}
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={16} />
        <span>Nova Despesa</span>
      </button>
      <div className={styles.card}>
        <h1 className={styles.heading}>Preencha os dados da despesa</h1>
        <div className={styles.grid}>          
          <div className={styles.field}>
            <label className={styles.label}>Data</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className={styles.input}
            />
          </div>
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
            placeholder="Adicione uma descrição para esta despesa"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className={styles.textarea}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.buttonSecondary} onClick={limparCampos}>Limpar campos</button>
          <button className={styles.buttonPrimary} onClick={registrar}>Registrar despesa</button>
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