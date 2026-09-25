import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { registerUserApi } from '../services/api';

const UserRegister = () => {
  const { login } = useUserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setErrorMsg('');
    if (form.password !== form.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      const res = await registerUserApi(form);
      login(res.token, res.user);
      navigate('/camps');
    } catch (err) {
      setErrorMsg(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content" style={{ paddingTop: '3rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <UserPlus size={30} />
          </div>
          <h2 style={{ color: 'var(--primary)' }}>Create User Account</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '.35rem' }}>Create an account to register for health camps</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', gap: 8 }}>
            <AlertCircle size={18} /> <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" name="fullName" value={form.fullName} onChange={change} required /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" value={form.email} onChange={change} required /></div>
          <div className="form-group"><label className="form-label">Mobile Number</label><input className="form-input" type="tel" name="mobileNumber" maxLength="10" value={form.mobileNumber} onChange={change} required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" name="password" minLength="6" value={form.password} onChange={change} required /></div>
          <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} required /></div>
          <button className="btn btn-success" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
