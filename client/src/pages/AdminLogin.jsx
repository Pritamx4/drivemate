import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, LogIn, Eye, EyeOff } from 'lucide-react';
import { adminLogin, isAdminLoggedIn } from '../components/PrivateRoute';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        adminLogin(data.token);
        navigate('/admin', { replace: true });
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Server connection failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="adminlogin-page">
      <div className="adminlogin-card">
        <div className="al-logo-wrap">
          <div className="al-logo-icon"><Car size={28} /></div>
          <span className="al-brand">Drive<span>Mate</span></span>
        </div>

        <h1>Admin Portal</h1>
        <p>Sign in to manage your rental fleet</p>

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              autoComplete="username"
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="al-field">
            <label>Password</label>
            <div className="al-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                autoComplete="current-password"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="al-eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="al-error">⚠️ {error}</div>}

          <button type="submit" className="btn-primary al-btn" disabled={loading}>
            {loading
              ? <span className="al-spinner"></span>
              : <><LogIn size={17} /> Sign In</>}
          </button>
        </form>

        <button className="al-back-link" onClick={() => navigate('/')}>
          ← Back to DriveMate
        </button>
      </div>
    </div>
  );
}
