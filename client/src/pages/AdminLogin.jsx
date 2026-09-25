import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { loginAdminApi, registerAdminApi } from '../services/api';

const AdminLogin = () => {
  const { language, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password) {
      setErrorMsg(language === 'te' ? 'వినియోగదారు పేరు లేదా పాస్వర్డ్ తప్పుగా ఉంది.' : 'Invalid username or password.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdminApi({ username: username.trim(), password });
      setLoading(false);
      login(res.token, res.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      if (err.message && err.message.includes('Invalid username or password')) {
        setErrorMsg(language === 'te' ? 'వినియోగదారు పేరు లేదా పాస్వర్డ్ తప్పుగా ఉంది.' : 'Invalid username or password.');
      } else {
        setErrorMsg(err.message || (language === 'te' ? 'వినియోగదారు పేరు లేదా పాస్వర్డ్ తప్పుగా ఉంది.' : 'Invalid username or password.'));
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg(language === 'te' ? 'యూజర్ నేమ్ తప్పనిసరి.' : 'Username is required.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg(language === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.' : 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(language === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలలేదు.' : 'Confirm password must match password.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerAdminApi({
        username: username.trim(),
        password,
        confirmPassword,
      });
      setLoading(false);
      setSuccessMsg(language === 'te' ? 'అడ్మిన్ ఖాతా విజయవంతంగా సృష్టించబడింది. ఇప్పుడు లాగిన్ చేయవచ్చు.' : 'Admin account created successfully.');
      setIsRegisterMode(false);
      setConfirmPassword('');
    } catch (err) {
      setLoading(false);
      if (err.message && err.message.includes('Username already exists')) {
        setErrorMsg(language === 'te' ? 'యూజర్ నేమ్ ఇప్పటికే ఉంది.' : 'Username already exists.');
      } else {
        setErrorMsg(err.message || 'Error creating admin account.');
      }
    }
  };

  return (
    <div className="container main-content" style={{ paddingTop: '4rem' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
          <button
            onClick={() => { setIsRegisterMode(false); resetForm(); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              fontWeight: '700',
              fontSize: '0.95rem',
              border: 'none',
              borderBottom: !isRegisterMode ? '3px solid var(--accent-blue)' : '3px solid transparent',
              color: !isRegisterMode ? 'var(--accent-blue)' : 'var(--text-muted)',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            {t('admin.loginTitle')}
          </button>
          <button
            onClick={() => { setIsRegisterMode(true); resetForm(); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              fontWeight: '700',
              fontSize: '0.95rem',
              border: 'none',
              borderBottom: isRegisterMode ? '3px solid var(--accent-blue)' : '3px solid transparent',
              color: isRegisterMode ? 'var(--accent-blue)' : 'var(--text-muted)',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            + Create Admin Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isRegisterMode ? '#059669' : '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            {isRegisterMode ? <UserPlus size={28} /> : <ShieldCheck size={32} />}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
            {isRegisterMode ? 'Create Admin Account' : t('admin.loginTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isRegisterMode ? 'Register a new administrator credential in MongoDB' : 'Authenticate against MongoDB admin database'}
          </p>
        </div>

        {/* Banners */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {!isRegisterMode && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group">
              <label className="form-label">{t('admin.username')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('admin.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : t('admin.loginBtn')}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {isRegisterMode && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter new admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password (Min 6 characters) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-block" style={{ padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
          <strong>Default Seed Demo Admin:</strong>
          <br />
          Username: <code style={{ color: 'var(--accent-blue)', fontWeight: '700' }}>admin</code> | Password: <code style={{ color: 'var(--accent-blue)', fontWeight: '700' }}>admin123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
