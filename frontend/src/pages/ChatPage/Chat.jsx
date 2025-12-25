// src/pages/ChatPage/Chat.jsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import MessageList from '../../components/messageBox/MessageList';
import MessageForm from '../../components/messageBox/MessageForm';
import styles from './Chat.module.css';

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
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <button onClick={onLogout} className={styles.logoutBtn}>
          Sign out
        </button>
        <Link to="/all-users" className={styles.usersLink}>
          👥 All Users
        </Link>
      </aside>

      <main className={styles.main}>
        {!selectedUser ? (
          <div className={styles.noChat}>
            <div className={styles.noChatIcon}>💬</div>
            <h3>Select someone to message</h3>
            <p>
              Go to <Link to="/all-users">All Users</Link> to start chatting
            </p>
          </div>
        ) : (
          <>
            <header className={styles.chatHeader}>
              <h2 className={styles.chatTitle}>
                Chat with {selectedUser.username}
              </h2>
              <p className={styles.chatMeta}>id: {selectedUser.id}</p>
            </header>

            {error && <div className={styles.error}>{error}</div>}

            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />

            <MessageForm onSend={handleSend} />

            {loadingMessages && (
              <div className={styles.loadingText}>Refreshing messages…</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
