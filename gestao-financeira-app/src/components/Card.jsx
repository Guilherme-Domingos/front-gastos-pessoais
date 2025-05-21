import React from 'react';
import styles from './Card.module.css';

export function Card({ title, icon, value, valueColor }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={`${styles.value} ${valueColor || ''}`}>{value}</div>
    </div>
  );
}