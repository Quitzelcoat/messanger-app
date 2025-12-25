import { useState } from 'react';
import styles from './MessageForm.module.css';

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
    <div className={styles.container}>
      <form onSubmit={submit} className={styles.form}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          disabled={disabled}
          className={styles.input}
          rows="1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              submit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className={styles.sendBtn}
        >
          Send
        </button>
      </form>
    </div>
  );
}
