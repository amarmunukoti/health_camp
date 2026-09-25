import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HeartPulse, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();
  const { isLoggedIn: isUserLoggedIn, user, logout: userLogout } = useUserAuth();

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <HeartPulse size={28} />
          </div>
          <div>
            <div className="brand-text-title">{t('appName')}</div>
            <div className="brand-text-tagline">{t('tagline')}</div>
          </div>
        </Link>

        {/* Navigation Links & Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav.home')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/camps" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav.healthCamps')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav.about')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  {t('nav.contact')}
                </NavLink>
              </li>

              {isUserLoggedIn ? (
                <>
                  <li>
                    <span className="nav-link" style={{ cursor: 'default' }}>Hi, {user?.fullName?.split(' ')[0]}</span>
                  </li>
                  <li>
                    <button onClick={userLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </>
              ) : null}

              {isLoggedIn ? (
                <>
                  <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'nav-link active admin-nav-link' : 'nav-link admin-nav-link')}>
                      {t('nav.adminDashboard')}
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      <LogOut size={16} /> Admin Logout
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </nav>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={18} style={{ color: 'var(--accent-blue)' }} />
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="lang-selector-btn"
              title="Switch Language"
            >
              {language === 'en' ? 'English | తెలుగు' : 'తెలుగు | English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
