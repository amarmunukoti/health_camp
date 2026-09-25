import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Phone,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchCampById } from '../services/api';
import RegistrationModal from '../components/RegistrationModal';
import PrintConfirmationModal from '../components/PrintConfirmationModal';

const CampDetails = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();

  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [showRegModal, setShowRegModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchCampById(id);
        setCamp(data);
        setLoading(false);
      } catch (err) {
        setErrorMsg('Health camp details could not be found.');
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container main-content" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        Loading health camp details...
      </div>
    );
  }

  if (errorMsg || !camp) {
    return (
      <div className="container main-content" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#991b1b', marginBottom: '1rem' }}>{errorMsg}</p>
        <Link to="/camps" className="btn btn-outline">
          <ArrowLeft size={16} /> {t('campDetails.back')}
        </Link>
      </div>
    );
  }

  // Bilingual Field Selection with Fallback
  const campTitle = (language === 'te' && camp.campNameTelugu) ? camp.campNameTelugu : camp.campNameEnglish;
  const description = (language === 'te' && camp.descriptionTelugu) ? camp.descriptionTelugu : camp.descriptionEnglish;
  const services = (language === 'te' && camp.servicesTelugu) ? camp.servicesTelugu : camp.servicesEnglish;

  const isFull = camp.availableSlots <= 0;
  const isCancelled = camp.status === 'Cancelled';
  const isCompleted = camp.status === 'Completed';

  return (
    <div className="container main-content" style={{ paddingTop: '2rem' }}>
      <Link to="/camps" className="btn btn-outline" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> {t('campDetails.back')}
      </Link>

      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header Title & Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="camp-type-badge">{camp.campType}</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
              {campTitle}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
              {t('campCard.organizer')}: <strong style={{ color: 'var(--primary)' }}>{camp.organizerName}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`status-badge status-${camp.status}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {camp.status === 'Upcoming' ? t('campCard.availableSlots') : (camp.status === 'Cancelled' ? t('campCard.cancelled') : t('campCard.completed'))}
            </span>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: isFull ? '#b91c1c' : '#15803d' }}>
              {camp.registeredParticipants} / {camp.maxParticipants} Registered ({camp.availableSlots} {t('campCard.slotsLeft')})
            </div>
          </div>
        </div>

        {/* Status Warning Alerts */}
        {isCancelled && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} />
            <span style={{ fontWeight: '600' }}>{t('campDetails.cancelledNotice')}</span>
          </div>
        )}

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
              <Calendar size={16} className="detail-icon" /> {t('campDetails.dateTime')}
            </div>
            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
              {camp.date} ({camp.startTime} - {camp.endTime})
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
              <MapPin size={16} className="detail-icon" /> {t('campDetails.location')}
            </div>
            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
              {camp.location}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{camp.address}</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>
              <Phone size={16} className="detail-icon" /> {t('campDetails.contact')}
            </div>
            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
              {camp.contactNumber}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            {t('campDetails.description')}
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {description}
          </p>
        </div>

        {/* Services Offered Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            {t('campDetails.services')}
          </h3>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {services.split(',').map((serv, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #7dd3fc', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', color: '#0369a1' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
                  {serv.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Register CTA Button */}
        <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {camp.status === 'Upcoming' ? (
            <button
              onClick={() => setShowRegModal(true)}
              disabled={isFull}
              className={`btn ${isFull ? 'btn-outline' : 'btn-success'}`}
              style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', borderRadius: '30px' }}
            >
              {isFull ? t('campDetails.campFullBtn') : t('campDetails.registerBtn')}
            </button>
          ) : (
            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Registration Closed for this Camp
            </span>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal
          camp={camp}
          onClose={() => setShowRegModal(false)}
          onSuccess={(regData) => {
            setShowRegModal(false);
            setConfirmationData(regData);
            // Refresh details page state
            setCamp(prev => ({
              ...prev,
              registeredParticipants: prev.registeredParticipants + 1,
              availableSlots: prev.availableSlots - 1
            }));
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

export default CampDetails;
