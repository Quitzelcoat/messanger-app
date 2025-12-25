// src/pages/HomePage/HomePage.jsx
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage({ onLogout }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.welcomeTitle}>Welcome to Messenger</h1>
        <p className={styles.subtitle}>
          Your conversations, organized. Start connecting with others or manage
          your account.
        </p>

        <div className={styles.actions}>
          <Link to="/all-users" className={styles.actionCard}>
            <span className={styles.actionIcon}>👥</span>
            See all users
          </Link>

          <Link to="/profile" className={styles.actionCard}>
            <span className={styles.actionIcon}>👤</span>
            Your Profile
          </Link>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          Sign out
        </button>
      </div>
    </div>
  );
}
