import React from 'react';
import { Home, ArrowUp, ArrowDown, BarChart, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Início', to: '/dashboard', icon: <Home size={20} /> },
];

const transactionItems = [
  { name: 'Nova Receita', to: '/dashboard/receita/nova', icon: <ArrowUp size={20} /> , iconColor: styles.arrowUp},
  { name: 'Nova Despesa', to: '/dashboard/despesa/nova', icon: <ArrowDown size={20} />, iconColor: styles.arrowDown},
];

const analysisItems = [
  { name: 'Perfil', to: '/dashboard/perfil', icon: <User size={20} /> }
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <h2 className={styles.title}>Finanças</h2>
        <nav>
          <div className={styles.navSection}>
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <p className={styles.sectionLabel}>Transações</p>
          <div className={styles.navSection}>
            {transactionItems.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                <span className={item.iconColor}>{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <p className={styles.sectionLabel}>Análises</p>
          <div className={styles.navSection}>
            {analysisItems.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <div>
        <p className={styles.userInfo}>Logado como João Buarque</p>
        <button className={styles.logoutButton}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}