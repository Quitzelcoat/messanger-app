import { useEffect, useRef } from 'react';
import styles from './MessageList.module.css';

export default function MessageList({ messages, currentUserId, onDelete }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <p>No messages yet - say hi!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {messages.map((m) => {
        const mine = m.senderId === currentUserId;
        const time = new Date(m.timestamp).toLocaleString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <div
            key={m.id}
            className={`${styles.messageWrapper} ${mine ? styles.mine : ''}`}
          >
            <div
              className={`${styles.messageBubble} ${
                mine ? styles.mine : styles.other
              }`}
            >
              <div className={styles.messageContent}>{m.content}</div>
              <div className={styles.messageMeta}>
                <span
                  className={`${styles.messageTime} ${
                    mine ? '' : styles.other
                  }`}
                >
                  {time}
                </span>
                <button
                  onClick={() => {
                    if (confirm('Delete this message?')) onDelete(m.id);
                  }}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
