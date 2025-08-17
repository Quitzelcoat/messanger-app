import { useState } from 'react';

export default function MessageForm({ onSend, disabled }) {
  const [text, setText] = useState('');

  const submit = async (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    await onSend(trimmed);
    setText('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #ddd',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            submit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        style={{ padding: '10px 12px' }}
      >
        Send
      </button>
    </form>
  );
}
