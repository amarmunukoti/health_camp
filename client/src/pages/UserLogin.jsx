import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, AlertCircle } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { loginUserApi } from '../services/api';

const UserLogin = () => {
  const { login } = useUserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await loginUserApi({ email: email.trim(), password });
      login(res.token, res.user);
      navigate('/home');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content" style={{ paddingTop: '4rem' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e0f2fe', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <HeartPulse size={32} />
          </div>
          <h2 style={{ color: 'var(--primary)' }}>User Login</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '.35rem' }}>Login to register for community health camps</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', gap: 8 }}>
            <AlertCircle size={18} /> <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: 40 }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: 40 }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
          </div>
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)' }}>
          New user? <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
