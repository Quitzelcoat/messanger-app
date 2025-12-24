import { Link } from 'react-router-dom';

export default function HomePage({ onLogout }) {
  return (
    <div>
      <h2>Welcome to the Messanger</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/all-users">See all users</Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Link to="/profile">Profile</Link>
      </div>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
