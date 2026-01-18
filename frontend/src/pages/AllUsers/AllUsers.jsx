// src/components/AllUsers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './AllUsers.module.css';

export default function AllUsers({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('No auth token — please log in.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const res = await fetch(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          let errMsg = res.statusText;
          try {
            const errBody = await res.json();
            errMsg = errBody?.error || errMsg;
          } catch {
            /* ignore json parsing errors */
          }
          throw new Error(errMsg || `Request failed (${res.status})`);
        }

        const data = await res.json();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load users');
          console.error('Fetch users error:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const openChatWith = (user) => {
    navigate(`/chat/?user=${encodeURIComponent(user.id)}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 className={styles.pageTitle}>All Users</h1>
      </div>

      <div className={styles.content}>
        {loading && <div className={styles.loading}>Loading users...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && users.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>👥</span>
            <p>No other users found.</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <>
            <ul className={styles.usersList}>
              {users.map((u) => (
                <li key={u.id} className={styles.userCard}>
                  <img
                    src={
                      u.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        u.username,
                      )}&background=1e293b&color=ffffff&size=56&bold=true`
                    }
                    alt={u.username}
                    className={styles.avatar}
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{u.username}</span>
                    <span className={styles.userId}>id: {u.id}</span>
                  </div>
                  <button
                    onClick={() => openChatWith(u)}
                    className={styles.messageButton}
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.statsBar}>
              <div>
                Total users:{' '}
                <span
                  style={{
                    color: 'var(--primary)',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                  }}
                >
                  {users.length}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
