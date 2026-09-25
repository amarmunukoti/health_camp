import React from 'react';
import { HeartPulse, ShieldAlert, Award, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language, t } = useLanguage();

  return (
    <div className="container main-content" style={{ paddingTop: '3rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Title */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">{t('aboutPage.title')}</h1>
          <div style={{ height: '4px', width: '60px', backgroundColor: 'var(--accent-blue)', margin: '0.75rem auto 0 auto', borderRadius: '2px' }}></div>
        </div>

        {/* Core Purpose Box */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse style={{ color: 'var(--accent-green)' }} /> Project Overview
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            {t('aboutPage.content')}
          </p>

          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ShieldAlert size={24} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#0369a1', fontWeight: '700', marginBottom: '4px' }}>
                  {t('aboutPage.disclaimerTitle')}
                </h4>
                <p style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  "{t('aboutPage.disclaimer')}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic / CSP Context Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              B.Tech CSP Initiative
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Developed as part of the Community Service Project (CSP) to bridge information gaps in rural and semi-urban health outreach.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Inclusive & Accessible
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Designed with full Telugu language support to empower citizens of all digital literacy levels to easily discover and register for medical camps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
