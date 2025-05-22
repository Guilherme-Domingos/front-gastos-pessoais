import React, { useState } from 'react';
import styles from './NewExpense.module.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NewExpense({ categories }) {
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const navigate = useNavigate();

  const limparCampos = () => {
    setData('');
    setCategoria('');
    setValor('');
    setDescricao('');
  };

  const registrar = () => {
    // lógica de registro da receita
    console.log({ data, categoria, valor, descricao });
    limparCampos();
    alert('Despesa registrada!');
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.backButton}
        onClick={() => navigate('/')}
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
            <input
              type="text"
              placeholder="Ex: Lazer, Alimentação..."
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className={styles.input}
            />
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
      </div>
    </div>
  );
}