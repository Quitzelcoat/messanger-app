import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
  const { token, handleLogout } = useAuth();
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
    } catch (err) {
      console.error('Save profile error', err);
      const msg = err.response?.data?.error || 'Could not save profile';
      setError(msg);
    } finally {
      setSaving(false);
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
      setTimeout(() => {
        handleLogout();
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.error('Change password error', err);
      setPwError(err.response?.data?.error || 'Could not change password');
    } finally {
      setPwSaving(false);
      setPwForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loading}>Loading profile…</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Profile</h1>
          <div className={styles.actions}>
            <Link to="/" className={styles.backLink}>
              ← Home
            </Link>
            <Link to="/all-users" className={styles.backLink}>
              👥 All Users
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sign out
            </button>
          </div>
        </div>

        <div className={styles.avatarSection}>
          {form.profilePic ? (
            <img
              src={form.profilePic}
              alt="Profile"
              className={styles.avatar}
            />
          ) : (
            <div
              className={styles.avatar}
              style={{
                background:
                  'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--white)',
              }}
            >
              {form.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className={styles.formSection}>
          {error && (
            <div className={`${styles.alert} ${styles.error}`}>{error}</div>
          )}
          {success && (
            <div className={`${styles.alert} ${styles.success}`}>{success}</div>
          )}

          <h2 className={styles.sectionTitle}>Account Details</h2>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Profile picture (URL)</label>
            <input
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              placeholder="https://..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Tell us about yourself..."
            />
          </div>

          <button type="submit" disabled={saving} className={styles.saveBtn}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>

        <div className={styles.divider}></div>

        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Change Password</h2>
          {pwError && (
            <div className={`${styles.alert} ${styles.error}`}>{pwError}</div>
          )}
          {pwSuccess && (
            <div className={`${styles.alert} ${styles.success}`}>
              {pwSuccess}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className={styles.field}>
              <label className={styles.label}>Current password</label>
              <input
                type="password"
                name="currentPassword"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>New password</label>
              <input
                type="password"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm new password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={pwForm.confirmNewPassword}
                onChange={handlePwChange}
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={pwSaving}
              className={styles.saveBtn}
            >
              {pwSaving ? 'Updating…' : 'Change password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
