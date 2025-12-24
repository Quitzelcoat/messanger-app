// src/components/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../auth/AuthProvider'; // adjust path if necessary
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { token, handleLogout } = useAuth(); // hook keeps axios header in sync
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const [form, setForm] = useState({
    id: null,
    username: '',
    email: '',
    profilePic: '',
    bio: '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(
          'http://localhost:3000/api/profile/me',
          {
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
          }
        );
        if (cancelled) return;
        setForm({
          id: data.id || null,
          username: data.username || '',
          email: data.email || '',
          profilePic: data.profilePic || '',
          bio: data.bio || '',
        });
      } catch (err) {
        console.error('Could not load profile', err);
        if (!cancelled) {
          setError(err.response?.data?.error || 'Could not load profile');
          if (err.response?.status === 401 || err.response?.status === 403) {
            handleLogout();
            navigate('/login');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [token, handleLogout, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      // only send fields you want to update
      const payload = {
        username: form.username,
        email: form.email,
        profilePic: form.profilePic,
        bio: form.bio,
      };

      const { data } = await axios.put(
        'http://localhost:3000/api/profile/me',
        payload
      );
      setForm((f) => ({
        ...f,
        username: data.username,
        email: data.email,
        profilePic: data.profilePic,
        bio: data.bio,
      }));
      setSuccess('Profile saved.');
      // optional: update token/username in UI if you rely on token payload elsewhere
    } catch (err) {
      console.error('Save profile error', err);
      const msg = err.response?.data?.error || 'Could not save profile';
      setError(msg);
    } finally {
      setSaving(false);
      // clear success after a short time
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError("New passwords don't match");
      return;
    }
    setPwSaving(true);
    try {
      await axios.put('http://localhost:3000/api/profile/me/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Password updated. Please log in again.');
      // For security, log user out after password change — force re-login
      setTimeout(() => {
        handleLogout();
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.error('Change password error', err);
      setPwError(err.response?.data?.error || 'Could not change password');
    } finally {
      setPwSaving(false);
      // clear password inputs
      setPwForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Profile</h2>
        <div>
          <Link to="/">Home</Link> &nbsp;|&nbsp;{' '}
          <Link to="/all-users">All Users</Link> &nbsp;|&nbsp;
          <button
            onClick={() => {
              handleLogout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading profile…</p>
      ) : (
        <>
          <form onSubmit={handleSave} style={{ marginBottom: 20 }}>
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <label style={{ display: 'block', marginBottom: 8 }}>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                style={{
                  display: 'block',
                  padding: 8,
                  width: '100%',
                  marginTop: 6,
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 8 }}>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  display: 'block',
                  padding: 8,
                  width: '100%',
                  marginTop: 6,
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 8 }}>
              Profile picture (URL)
              <input
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                placeholder="https://..."
                style={{
                  display: 'block',
                  padding: 8,
                  width: '100%',
                  marginTop: 6,
                }}
              />
            </label>

            {form.profilePic && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={form.profilePic}
                  alt="profile"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </div>
            )}

            <label style={{ display: 'block', marginBottom: 8 }}>
              Bio
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                style={{
                  display: 'block',
                  padding: 8,
                  width: '100%',
                  marginTop: 6,
                }}
              />
            </label>

            <div style={{ marginTop: 10 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '8px 12px' }}
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>

          <hr />

          <section style={{ marginTop: 16 }}>
            <h3>Change password</h3>
            {pwError && <p style={{ color: 'crimson' }}>{pwError}</p>}
            {pwSuccess && <p style={{ color: 'green' }}>{pwSuccess}</p>}

            <form onSubmit={handleChangePassword}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Current password
                <input
                  type="password"
                  name="currentPassword"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange}
                  required
                  style={{
                    display: 'block',
                    padding: 8,
                    width: '100%',
                    marginTop: 6,
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: 8 }}>
                New password
                <input
                  type="password"
                  name="newPassword"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  required
                  style={{
                    display: 'block',
                    padding: 8,
                    width: '100%',
                    marginTop: 6,
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: 8 }}>
                Confirm new password
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={pwForm.confirmNewPassword}
                  onChange={handlePwChange}
                  required
                  style={{
                    display: 'block',
                    padding: 8,
                    width: '100%',
                    marginTop: 6,
                  }}
                />
              </label>

              <div style={{ marginTop: 10 }}>
                <button type="submit" disabled={pwSaving}>
                  {pwSaving ? 'Updating…' : 'Change password'}
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
