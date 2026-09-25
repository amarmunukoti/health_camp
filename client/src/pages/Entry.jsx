import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, UserCheck, ShieldCheck } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useAuth } from '../context/AuthContext';

const Entry = () => {
  const navigate = useNavigate();
  const { isLoggedIn: isUserLoggedIn } = useUserAuth();
  const { isLoggedIn: isAdminLoggedIn } = useAuth();

  React.useEffect(() => {
    if (isAdminLoggedIn) navigate('/admin/dashboard', { replace: true });
    else if (isUserLoggedIn) navigate('/home', { replace: true });
  }, [isAdminLoggedIn, isUserLoggedIn, navigate]);

  return (
    <div className="entry-page">
      <div className="entry-card">
        <div className="entry-logo"><HeartPulse size={42} /></div>
        <h1>Community Health Camp Portal</h1>
        <p className="entry-subtitle">Welcome! Please select how you want to continue.</p>

        <div className="entry-options">
          <button className="entry-option user-option" onClick={() => navigate('/login')}>
            <span className="entry-option-icon"><UserCheck size={30} /></span>
            <span>
              <strong>User Login</strong>
              <small>Login to register for health camps and appointments</small>
            </span>
          </button>

          <button className="entry-option admin-option" onClick={() => navigate('/admin/login')}>
            <span className="entry-option-icon"><ShieldCheck size={30} /></span>
            <span>
              <strong>Admin Login</strong>
              <small>Login to manage camps, registrations and portal data</small>
            </span>
          </button>
        </div>

        <p className="entry-note">Your login will take you directly to the appropriate portal.</p>
      </div>
    </div>
  );
};

export default Entry;
