import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CampCard = ({ camp, onRegisterClick }) => {
  const { language, t } = useLanguage();

  // Helper to resolve bilingual category name
  const getCategoryTranslation = (type) => {
    const keyMap = {
      'General Health Check-up': 'categories.general',
      'Eye Check-up': 'categories.eye',
      'Dental Camp': 'categories.dental',
      'Blood Donation Camp': 'categories.blood',
      'Diabetes Screening': 'categories.diabetes',
      'Vaccination Camp': 'categories.vaccination',
      'Women\'s Health Camp': 'categories.women',
      'Children\'s Health Camp': 'categories.children',
      'Other': 'categories.other',
    };
    return keyMap[type] ? t(keyMap[type]) : type;
  };

  // Determine Title & Description based on language selection & availability
  const title = (language === 'te' && camp.campNameTelugu) ? camp.campNameTelugu : camp.campNameEnglish;

  const isFull = camp.availableSlots <= 0;
  const isCancelled = camp.status === 'Cancelled';
  const isCompleted = camp.status === 'Completed';

  return (
    <div className="camp-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="camp-type-badge">
          {getCategoryTranslation(camp.campType)}
        </span>
        <span className={`status-badge status-${camp.status}`}>
          {camp.status === 'Upcoming' ? t('campCard.availableSlots') : (camp.status === 'Cancelled' ? t('campCard.cancelled') : t('campCard.completed'))}
        </span>
      </div>

      <h3 className="camp-card-title">{title}</h3>
      <p className="camp-card-organizer">
        {t('campCard.organizer')}: <strong>{camp.organizerName}</strong>
      </p>

      <div className="camp-card-details">
        <div className="detail-row">
          <Calendar size={16} className="detail-icon" />
          <span>{camp.date}</span>
        </div>
        <div className="detail-row">
          <Clock size={16} className="detail-icon" />
          <span>{camp.startTime} - {camp.endTime}</span>
        </div>
        <div className="detail-row">
          <MapPin size={16} className="detail-icon" />
          <span>{camp.location}</span>
        </div>
        <div className="detail-row">
          <Users size={16} className="detail-icon" />
          <span>
            {camp.registeredParticipants} / {camp.maxParticipants}{' '}
            <span className={`slots-badge ${isFull ? 'slots-full' : 'slots-available'}`}>
              ({isFull ? t('campCard.full') : `${camp.availableSlots} ${t('campCard.slotsLeft')}`})
            </span>
          </span>
        </div>
      </div>

      <div className="camp-card-actions">
        <Link to={`/camps/${camp._id}`} className="btn btn-outline" style={{ flex: 1 }}>
          {t('campCard.viewDetails')}
        </Link>

        {camp.status === 'Upcoming' && (
          <button
            onClick={() => onRegisterClick && onRegisterClick(camp)}
            disabled={isFull}
            className={`btn ${isFull ? 'btn-outline' : 'btn-success'}`}
            style={{ flex: 1 }}
          >
            {isFull ? t('campCard.full') : t('campCard.registerNow')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampCard;
