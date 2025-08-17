// src/components/AllUsers.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
        const res = await fetch('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If non-2xx, try to read JSON error message, else use statusText
        if (!res.ok) {
          let errMsg = res.statusText;
          try {
            const errBody = await res.json();
            errMsg = errBody?.error || errMsg;
          } catch (e) {
            e; /* ignore json parsing errors */
          }
          throw new Error(errMsg || `Request failed (${res.status})`);
        }

        const data = await res.json();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          // fetch throws Error — so use err.message
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
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <Link to={'/'}>Home</Link>
      <h2>All Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && users.length === 0 && <p>No other users found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((u) => (
          <li
            key={u.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
            }}
          >
            <img
              src={
                u.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.username
                )}&background=ddd`
              }
              alt={u.username}
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{u.username}</div>
              <div style={{ fontSize: 12, color: '#666' }}>id: {u.id}</div>
            </div>
            <div>
              <button onClick={() => openChatWith(u)}>Message</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
