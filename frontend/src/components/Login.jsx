import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/login',
        form
      );

      localStorage.setItem('token', data.token);
      setToken(data.token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.error || 'Login failed';
      setError(msg);
    }
  };

  return (
    <>
      <h2>Log In</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" onChange={handleChange} required />
        </label>

        <label>
          password
          <input
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Log In</button>
      </form>

      <p>
        Need an account? <a href="/signup">Sign Up</a>
      </p>
    </>
  );
}
