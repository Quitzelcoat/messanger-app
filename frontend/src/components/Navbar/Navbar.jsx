import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logoDot} />
        <span className={styles.logoText}>ConnectSphere</span>
      </div>

      <div className={styles.actions}>
        <button
          onClick={toggleTheme} // ← ADD THIS!
          className={styles.themeBtn}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {onLogout && (
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
