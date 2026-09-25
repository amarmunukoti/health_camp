import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { createCampApi, updateCampApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminCampModal = ({ camp, onClose, onSuccess }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    campNameEnglish: '',
    campNameTelugu: '',
    organizerName: '',
    campType: 'General Health Check-up',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    location: '',
    address: '',
    descriptionEnglish: '',
    descriptionTelugu: '',
    servicesEnglish: '',
    servicesTelugu: '',
    contactNumber: '',
    maxParticipants: 100,
    status: 'Upcoming',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (camp) {
      setFormData({
        campNameEnglish: camp.campNameEnglish || '',
        campNameTelugu: camp.campNameTelugu || '',
        organizerName: camp.organizerName || '',
        campType: camp.campType || 'General Health Check-up',
        date: camp.date || '',
        startTime: camp.startTime || '09:00 AM',
        endTime: camp.endTime || '04:00 PM',
        location: camp.location || '',
        address: camp.address || '',
        descriptionEnglish: camp.descriptionEnglish || '',
        descriptionTelugu: camp.descriptionTelugu || '',
        servicesEnglish: camp.servicesEnglish || '',
        servicesTelugu: camp.servicesTelugu || '',
        contactNumber: camp.contactNumber || '',
        maxParticipants: camp.maxParticipants || 100,
        status: camp.status || 'Upcoming',
      });
    }
  }, [camp]);

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

    if (!formData.campNameEnglish.trim()) {
      setErrorMsg('Camp Name (English) is required.');
      return;
    }
    if (!formData.organizerName.trim()) {
      setErrorMsg('Organizer Name is required.');
      return;
    }
    if (!formData.location.trim() || !formData.address.trim()) {
      setErrorMsg('Location and Address are required.');
      return;
    }

    try {
      setLoading(true);
      if (camp && camp._id) {
        await updateCampApi(token, camp._id, formData);
      } else {
        await createCampApi(token, formData);
      }
      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Error saving health camp.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{camp ? 'Edit Health Camp' : 'Add New Health Camp'}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Camp Name (English) *</label>
                <input type="text" name="campNameEnglish" className="form-input" value={formData.campNameEnglish} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Camp Name (Telugu)</label>
                <input type="text" name="campNameTelugu" className="form-input" value={formData.campNameTelugu} onChange={handleChange} placeholder="ఉదా: ఉచిత కంటి పరీక్ష శిబిరం" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Organizer Name *</label>
                <input type="text" name="organizerName" className="form-input" value={formData.organizerName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Camp Type *</label>
                <select name="campType" className="form-select" value={formData.campType} onChange={handleChange} required>
                  <option value="General Health Check-up">General Health Check-up</option>
                  <option value="Eye Check-up">Eye Check-up</option>
                  <option value="Dental Camp">Dental Camp</option>
                  <option value="Blood Donation Camp">Blood Donation Camp</option>
                  <option value="Diabetes Screening">Diabetes Screening</option>
                  <option value="Vaccination Camp">Vaccination Camp</option>
                  <option value="Women's Health Camp">Women's Health Camp</option>
                  <option value="Children's Health Camp">Children's Health Camp</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input type="text" name="startTime" className="form-input" value={formData.startTime} onChange={handleChange} placeholder="e.g. 09:00 AM" required />
              </div>
              <div className="form-group">
                <label className="form-label">End Time *</label>
                <input type="text" name="endTime" className="form-input" value={formData.endTime} onChange={handleChange} placeholder="e.g. 04:00 PM" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location / City / Mandal *</label>
                <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number *</label>
                <input type="text" name="contactNumber" className="form-input" value={formData.contactNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Venue Address *</label>
              <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Description (English) *</label>
                <textarea name="descriptionEnglish" rows="3" className="form-textarea" value={formData.descriptionEnglish} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Description (Telugu)</label>
                <textarea name="descriptionTelugu" rows="3" className="form-textarea" value={formData.descriptionTelugu} onChange={handleChange}></textarea>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Services Offered (English) *</label>
                <textarea name="servicesEnglish" rows="2" className="form-textarea" value={formData.servicesEnglish} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Services Offered (Telugu)</label>
                <textarea name="servicesTelugu" rows="2" className="form-textarea" value={formData.servicesTelugu} onChange={handleChange}></textarea>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Max Participants *</label>
                <input type="number" name="maxParticipants" className="form-input" value={formData.maxParticipants} onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Camp Status *</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Health Camp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCampModal;
