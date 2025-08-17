import { useEffect, useRef } from 'react';

export default function MessageList({ messages, currentUserId, onDelete }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div>
      {messages.length === 0 && (
        <p style={{ color: '#666' }}>No messages yet - say hi!</p>
      )}

      {messages.map((m) => {
        const mine = m.senderId === currentUserId;
        const time = new Date(m.timestamp).toLocaleString();
        return (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: mine ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '8px 12px',
                borderRadius: 12,
                background: mine ? '#d1ffd6' : '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 6 }}>{m.content}</div>
              <div style={{ fontSize: 11, color: '#666', textAlign: 'right' }}>
                {time}
              </div>

              <button
                onClick={() => {
                  if (confirm('Delete this message?')) onDelete(m.id);
                }}
                style={{ fontSize: 12, color: 'crimson' }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
