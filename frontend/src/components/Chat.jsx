export default function Chat({ onLogout }) {
  return (
    <div>
      <h2>Chat</h2>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
