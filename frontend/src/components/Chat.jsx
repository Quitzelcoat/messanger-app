import { Link } from 'react-router-dom';

export default function Chat({ onLogout }) {
  return (
    <div>
      <h2>Chat</h2>

      <button onClick={onLogout}>Logout</button>

      <div style={{ marginTop: 12 }}>
        <Link to="/all-users">See all users</Link>
      </div>
    </div>
  );
}
