import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer no-print">
      <div className="container">
        <div className="footer-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <HeartPulse size={24} style={{ color: 'var(--accent-green)' }} />
              <span className="footer-brand-title">{t('appName')}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              {t('hero.subtitle')}
            </p>
            <div className="footer-disclaimer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#38bdf8', marginBottom: '4px' }}>
                <ShieldAlert size={16} /> {t('aboutPage.disclaimerTitle')}
              </div>
              {t('aboutPage.disclaimer')}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/camps">{t('nav.healthCamps')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/admin/login">{t('nav.adminLogin')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>{t('contactPage.title')}</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('contactPage.communityLabel')}</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t('contactPage.communityText')}</p>
            <p style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.5rem' }}>Email: support@communityhealthcamp.org</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Community Health Camp Portal | B.Tech Community Service Project (CSP)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
