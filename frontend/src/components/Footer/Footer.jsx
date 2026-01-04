import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>ConnectSphere</span>
        </div>
        <div className={styles.right}>
          <span className={styles.text}>
            © {year} Haris Saeed All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
