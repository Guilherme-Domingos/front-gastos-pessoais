import React, { useState, useContext } from 'react';
import styles from './NewRecipe.module.css';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from '../../contexts/CategoryContext';
import { CategoryModal } from '../../components/CategoryModal';
import { TransactionContext } from '../../contexts/TransactionContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Api } from '../../services/api';

export function NewRecipe() {
  const [data, setData] = useState('');
  const [remetente, setRemetente] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { adicionarTransacao } = useContext(TransactionContext);
  const { categories, adicionarCategoria } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);

  const limparCampos = () => {
    setData('');
    setRemetente('');
    setCategoria('');
    setValor('');
    setDescricao('');
  };

 const registrar = async () => {
      // const user = JSON.parse(localStorage.getItem('user'));
      const categoriaSelecionada = categories.find(cat => cat.name === categoria);

      if (!user) {
          alert('Você precisa estar logado para registrar uma receita.');
          return;
      }
 
      const novaReceita = {
          amount: parseFloat(valor),
          description: descricao,
          date: new Date(data).toISOString(), // Formato ISO 8601
          type: 'RECEITA',
          sender: remetente, 
          userId: user.id, 
          categoryId: categoriaSelecionada.id  
      };
 
      const novaReceitaToList = {
          amount: parseFloat(valor),
          description: descricao,
          date: new Date(data).toISOString(), // Formato ISO 8601
          transactionType: 'RECEITA',
          sender: remetente, 
          userId: user.id, 
          categoryId: categoriaSelecionada.id
      };

     try {
         const api = Api();
         const response = await api.post('/transaction', novaReceita);
         const {data} = response.data;
         alert('Receita registrada!');
          adicionarTransacao({id: data, ...novaReceitaToList});
         navigate('/dashboard');
     } catch (error) {
         console.error('Erro ao registrar receita:', error);
         alert('Falha ao registrar a receita.');
     }
 };
 

  const handleSaveCategory = async (name) => {
      // const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
          alert('Você precisa estar logado para registrar uma despesa.');
          return;
      }
  
      const novaCategoria = {
        name,
        userId: user.id 
      };
  
      try {
        const api = Api();
        const response = await api.post('/category', novaCategoria);
        const { data } = response.data;
        adicionarCategoria({id: data, ...novaCategoria});
        setCategoria(name);
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Falha ao adicionar a categoria.');
      }
  
    };

  return (
    <div className={styles.wrapper}>      
    <button
        className={styles.backButton}
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={16} />
        <span>Nova Receita</span>
      </button>

      <div className={styles.card}>
        <h1 className={styles.heading}>Preencha os dados da receita</h1>

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
            <label className={styles.label}>Remetente</label>
            <input
              type="text"
              placeholder="Ex: Empresa XYZ"
              value={remetente}
              onChange={e => setRemetente(e.target.value)}
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
            placeholder="Adicione uma descrição para esta receita"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.buttonSecondary} onClick={limparCampos}>Limpar campos</button>
          <button className={styles.buttonPrimary} onClick={registrar}>Registrar Receita</button>
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