// CategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './CategoryModal.module.css';

/**
 * Props:
 * - isOpen: boolean to show/hide modal
 * - onClose: function to call when closing
 * - onSave: function(categoryName) to call when saving
 */
export function CategoryModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');

  // Reset input when opened
  useEffect(() => {
    if (isOpen) setName('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Cadastrar Categoria</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className={styles.body}>
          <label className={styles.label} htmlFor="categoryName">Nome da categoria</label>
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.input}
            placeholder="Ex: Alimentação"
          />
        </div>
        <footer className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={styles.saveButton} onClick={handleSave}>Salvar</button>
        </footer>
      </div>
    </div>
  );
}