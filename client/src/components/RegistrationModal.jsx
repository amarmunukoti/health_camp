import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUserAuth } from '../context/UserAuthContext';
import { registerCitizenForCamp } from '../services/api';

const RegistrationModal = ({ camp, onClose, onSuccess }) => {
  const { language, t } = useLanguage();
  const { user } = useUserAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: '',
    gender: '',
    mobileNumber: user?.mobileNumber || '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const campTitle = (language === 'te' && camp.campNameTelugu) ? camp.campNameTelugu : camp.campNameEnglish;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Frontend Validations
    if (!formData.fullName.trim()) {
      setErrorMsg(language === 'te' ? 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.' : 'Full Name is required.');
      return;
    }
    if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      setErrorMsg(language === 'te' ? 'చెల్లుబాటు అయ్యే వయస్సు నమోదు చేయండి (1-120).' : 'Please enter a valid age between 1 and 120.');
      return;
    }
    if (!formData.gender) {
      setErrorMsg(language === 'te' ? 'దయచేసి మీ లింగాన్ని ఎంచుకోండి.' : 'Gender is required.');
      return;
    }
    if (!formData.mobileNumber || !/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      setErrorMsg(language === 'te' ? '10 అంకెల మొబైల్ నంబర్‌ను సరిగ్గా నమోదు చేయండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg(language === 'te' ? 'దయచేసి మీ చిరునామా నమోదు చేయండి.' : 'Address is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerCitizenForCamp(camp._id, formData);
      setLoading(false);
      onSuccess(res.registration);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{t('registration.title')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{campTitle}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">{t('registration.fullName')}</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder={t('registration.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('registration.age')}</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder={t('registration.agePlaceholder')}
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('registration.gender')}</label>
                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('registration.genderSelect')}</option>
                  <option value="Male">{t('registration.male')}</option>
                  <option value="Female">{t('registration.female')}</option>
                  <option value="Other">{t('registration.other')}</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">{t('registration.mobileNumber')}</label>
              <input
                type="tel"
                name="mobileNumber"
                className="form-input"
                placeholder={t('registration.mobilePlaceholder')}
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">{t('registration.address')}</label>
              <textarea
                name="address"
                rows="3"
                className="form-textarea"
                placeholder={t('registration.addressPlaceholder')}
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {t('registration.notice')}
            </p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {t('registration.cancelBtn')}
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Processing...' : t('registration.submitBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
