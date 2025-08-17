import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

export default function Chat({ token, onLogout }) {
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user');

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const t = token || localStorage.getItem('token');
    if (t) axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  useEffect(() => {
    const raw = token || localStorage.getItem('token');
    if (!raw) return;
    try {
      const payload = JSON.parse(atob(raw.split('.')[1]));
      if (payload?.userId) setCurrentUserId(payload.userId);
    } catch (e) {
      console.error('Invalid token format', e);
    }
  }, [token]);

  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      setMessages([]);
      setError('');
      return;
    }

    let cancelled = false;
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${selectedUserId}`);
        if (data) setSelectedUser(data);
        else
          setSelectedUser({
            id: Number(selectedUserId),
            username: `User ${selectedUserId}`,
          });
      } catch (err) {
        console.error('Fetch user', err);
        if (!cancelled)
          setSelectedUser({
            id: Number(selectedUserId),
            username: `User ${selectedUserId}`,
          });
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [selectedUserId]);

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId) return;
    setLoadingMessages(true);
    setError('');
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/messages?withUser=${encodeURIComponent(
          selectedUserId
        )}`
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch messages error', err);
      setError(err.response?.data?.error || 'Could not load messages');
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchMessages();
    const iv = selectedUserId ? setInterval(fetchMessages, 3000) : null;
    return () => {
      if (iv) clearInterval(iv);
    };
  }, [fetchMessages, selectedUserId]);

  const handleSend = async (text) => {
    if (!selectedUserId) return;
    try {
      const payload = { receiverId: Number(selectedUserId), content: text };
      const { data } = await axios.post(
        'http://localhost:3000/api/messages',
        payload
      );
      setMessages((m) => [...m, data]);
    } catch (err) {
      console.error('Send message error', err);
      setError(err.response?.data?.error || 'Could not send message');
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://localhost:3000/api/messages/${messageId}`);
      setMessages((cur) => cur.filter((m) => m.id !== messageId));
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.response?.data?.error || 'Could not delete message');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <aside style={{ width: 280 }}>
        <div style={{ marginBottom: 12 }}>
          <button onClick={onLogout}>Logout</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <Link to="/all-users">All Users</Link>
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <h2>Chat</h2>

        {!selectedUser ? (
          <p>
            Select someone to message — go to{' '}
            <Link to="/all-users">All Users</Link>
          </p>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <strong>Chat with {selectedUser.username}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>
                id: {selectedUser.id}
              </div>
            </div>

            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />

            <MessageForm onSend={handleSend} />

            {loadingMessages && (
              <p style={{ fontSize: 12, color: '#666' }}>
                Refreshing messages…
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
