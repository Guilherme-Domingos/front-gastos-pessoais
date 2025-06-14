import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css'; // Reusing Header styles or create a separate one

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      logout();
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className={styles.logoutButton}
      title="Sair"
    >
      <LogOut size={20} />
      <span>Sair</span>
    </button>
  );
};

export default LogoutButton;
