import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Stethoscope,
  Eye,
  Smile,
  Droplet,
  Activity,
  Syringe,
  Heart,
  Baby,
  Sparkles,
  MapPin,
  Calendar,
  ClipboardCheck,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchUpcomingCamps } from '../services/api';
import CampCard from '../components/CampCard';
import RegistrationModal from '../components/RegistrationModal';
import PrintConfirmationModal from '../components/PrintConfirmationModal';

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampForReg, setSelectedCampForReg] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const getCamps = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingCamps();
        setUpcomingCamps(data.slice(0, 3)); // Top 3 featured camps
        setLoading(false);
      } catch (err) {
        console.error('Error fetching upcoming camps:', err);
        setLoading(false);
      }
    };
    getCamps();
  }, []);

  const categories = [
    { type: 'General Health Check-up', key: 'categories.general', icon: <Stethoscope /> },
    { type: 'Eye Check-up', key: 'categories.eye', icon: <Eye /> },
    { type: 'Dental Camp', key: 'categories.dental', icon: <Smile /> },
    { type: 'Blood Donation Camp', key: 'categories.blood', icon: <Droplet /> },
    { type: 'Diabetes Screening', key: 'categories.diabetes', icon: <Activity /> },
    { type: 'Vaccination Camp', key: 'categories.vaccination', icon: <Syringe /> },
    { type: 'Women\'s Health Camp', key: 'categories.women', icon: <Heart /> },
    { type: 'Children\'s Health Camp', key: 'categories.children', icon: <Baby /> },
    { type: 'Other', key: 'categories.other', icon: <Sparkles /> },
  ];

  const handleCategoryClick = (categoryType) => {
    navigate(`/camps?category=${encodeURIComponent(categoryType)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <Link to="/camps" className="btn-hero">
            <Search size={20} />
            {t('hero.exploreBtn')}
          </Link>
        </div>
      </section>

      <div className="container main-content" style={{ paddingTop: '3rem' }}>
        {/* Category Showcase */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <h2 className="section-title">{t('categories.title')}</h2>
            <p className="section-subtitle">Select a category to quickly filter camps</p>
          </div>
          <div className="category-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card" onClick={() => handleCategoryClick(cat.type)}>
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{t(cat.key)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Upcoming Camps */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 className="section-title">{t('homeSections.upcomingTitle')}</h2>
              <p className="section-subtitle">Discover free health camps happening soon near you</p>
            </div>
            <Link to="/camps" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {t('homeSections.viewAll')} →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading upcoming health camps...
            </div>
          ) : upcomingCamps.length === 0 ? (
            <div className="camp-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>{t('campsPage.noCamps')}</p>
            </div>
          ) : (
            <div className="grid-camps">
              {upcomingCamps.map((camp) => (
                <CampCard
                  key={camp._id}
                  camp={camp}
                  onRegisterClick={(selected) => setSelectedCampForReg(selected)}
                />
              ))}
            </div>
          )}
        </section>

        {/* How It Works (4 Steps) */}
        <section style={{ marginBottom: '4rem', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 1.5rem' }}>
          <div className="section-header">
            <h2 className="section-title">{t('homeSections.howItWorksTitle')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textCenter: 'center', padding: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Search size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
                1. {t('homeSections.step1Title')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('homeSections.step1Desc')}
              </p>
            </div>

            <div style={{ textCenter: 'center', padding: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Calendar size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
                2. {t('homeSections.step2Title')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('homeSections.step2Desc')}
              </p>
            </div>

            <div style={{ textCenter: 'center', padding: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <ClipboardCheck size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
                3. {t('homeSections.step3Title')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('homeSections.step3Desc')}
              </p>
            </div>

            <div style={{ textCenter: 'center', padding: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <CheckCircle size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>
                4. {t('homeSections.step4Title')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('homeSections.step4Desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Why Use This Portal (Community Benefits) */}
        <section style={{ marginBottom: '2rem' }}>
          <div className="section-header">
            <h2 className="section-title">{t('homeSections.whyUseTitle')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={22} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--primary)' }}>
                  {t(`homeSections.benefit${num}`)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Registration Modal */}
      {selectedCampForReg && (
        <RegistrationModal
          camp={selectedCampForReg}
          onClose={() => setSelectedCampForReg(null)}
          onSuccess={(regData) => {
            setSelectedCampForReg(null);
            setConfirmationData(regData);
          }}
        />
      )}

      {/* Print Confirmation Modal */}
      {confirmationData && (
        <PrintConfirmationModal
          registration={confirmationData}
          onClose={() => setConfirmationData(null)}
        />
      )}
    </div>
  );
};

export default Home;
