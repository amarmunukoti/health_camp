import React from 'react';
import { CheckCircle2, Printer, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PrintConfirmationModal = ({ registration, onClose }) => {
  const { language, t } = useLanguage();

  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  const campTitle = (language === 'te' && registration.camp.campNameTelugu)
    ? registration.camp.campNameTelugu
    : registration.camp.campNameEnglish;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={24} style={{ color: 'var(--accent-green)' }} />
            <h3 className="modal-title">{t('confirmation.title')}</h3>
          </div>
        </div>

        <div className="modal-body">
          {/* Printable Ticket Pass Box */}
          <div className="print-confirmation-box print-area">
            <div className="print-header">
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700' }}>
                {t('appName')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: '600' }}>
                Official Registration Pass / స్పందన ధృవీకరణ పత్రం
              </p>
              <div className="print-reg-id">
                {t('confirmation.regId')}: {registration.registrationId}
              </div>
            </div>

            <div className="print-details-grid">
              <div className="print-detail-item">
                <label>{t('confirmation.citizenName')}</label>
                <span>{registration.fullName}</span>
              </div>
              <div className="print-detail-item">
                <label>Age & Gender / వయస్సు & లింగం</label>
                <span>{registration.age} Yrs / {registration.gender}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('registration.mobileNumber')}</label>
                <span>{registration.mobileNumber}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('confirmation.campName')}</label>
                <span>{campTitle}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('confirmation.date')}</label>
                <span>{registration.camp.date}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('confirmation.time')}</label>
                <span>{registration.camp.startTime} - {registration.camp.endTime}</span>
              </div>
              <div className="print-detail-item" style={{ gridColumn: '1 / -1' }}>
                <label>{t('confirmation.location')}</label>
                <span>{registration.camp.location} - {registration.camp.address}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('campCard.organizer')}</label>
                <span>{registration.camp.organizerName}</span>
              </div>
              <div className="print-detail-item">
                <label>{t('confirmation.contact')}</label>
                <span>{registration.camp.contactNumber}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', textCenter: 'center' }}>
              * Please present this pass or Registration ID at the camp desk for free services.
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-outline" onClick={onClose}>
            <ArrowLeft size={16} /> {t('confirmation.backBtn')}
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> {t('confirmation.printBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintConfirmationModal;
