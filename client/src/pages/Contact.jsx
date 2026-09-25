import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { language, t } = useLanguage();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container main-content" style={{ paddingTop: '3rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="section-title">{t('contactPage.title')}</h1>
        <p className="section-subtitle">{t('contactPage.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '10px', borderRadius: '10px' }}>
              <Mail size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('contactPage.emailLabel')}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>csp.healthcamp@college.edu</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>info@communityhealthcamp.org</p>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', color: '#059669', padding: '10px', borderRadius: '10px' }}>
              <Phone size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('contactPage.phoneLabel')}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>+91 98480 12345 (Helpline)</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Toll Free: 1800-425-43258</p>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '10px' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('contactPage.communityLabel')}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('contactPage.communityText')}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Community Service Cell, B.Tech CSP Campus</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.25rem' }}>
            {language === 'te' ? 'సందేశం పంపండి' : 'Send us a Message'}
          </h3>

          {submitted ? (
            <div style={{ textCenter: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--accent-green)', margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {language === 'te' ? 'ధన్యవాదాలు! మీ సందేశం అందింది.' : 'Thank You! Message Received.'}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {language === 'te' ? 'మా వాలంటీర్ టీమ్ త్వరలో మిమ్మల్ని సంప్రదిస్తారు.' : 'Our community volunteers will respond shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('registration.fullName')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('registration.mobileNumber')}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactForm.mobile}
                  onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message / సందేశం</label>
                <textarea
                  rows="4"
                  className="form-textarea"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Send size={16} /> {language === 'te' ? 'సందేశం పంపండి' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
