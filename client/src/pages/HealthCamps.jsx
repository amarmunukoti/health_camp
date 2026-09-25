import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchAllCamps } from '../services/api';
import CampCard from '../components/CampCard';
import RegistrationModal from '../components/RegistrationModal';
import PrintConfirmationModal from '../components/PrintConfirmationModal';
import { useUserAuth } from '../context/UserAuthContext';

const HealthCamps = () => {
  const { t } = useLanguage();
  const { isLoggedIn: isUserLoggedIn } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [selectedCampForReg, setSelectedCampForReg] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const getCamps = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCamps();
        setCamps(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading camps:', err);
        setLoading(false);
      }
    };
    getCamps();
  }, []);

  // Unique locations list for dropdown filter
  const locationsList = Array.from(new Set(camps.map(c => c.location).filter(Boolean)));

  const categories = [
    { type: 'General Health Check-up', key: 'categories.general' },
    { type: 'Eye Check-up', key: 'categories.eye' },
    { type: 'Dental Camp', key: 'categories.dental' },
    { type: 'Blood Donation Camp', key: 'categories.blood' },
    { type: 'Diabetes Screening', key: 'categories.diabetes' },
    { type: 'Vaccination Camp', key: 'categories.vaccination' },
    { type: 'Women\'s Health Camp', key: 'categories.women' },
    { type: 'Children\'s Health Camp', key: 'categories.children' },
    { type: 'Other', key: 'categories.other' },
  ];

  // Filtering Logic
  const filteredCamps = camps.filter((camp) => {
    // Search query matching English name, Telugu name, Location, Organizer
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      camp.campNameEnglish.toLowerCase().includes(q) ||
      (camp.campNameTelugu && camp.campNameTelugu.toLowerCase().includes(q)) ||
      camp.location.toLowerCase().includes(q) ||
      camp.organizerName.toLowerCase().includes(q)
    );

    const matchesCategory = !selectedCategory || camp.campType === selectedCategory;
    const matchesLocation = !selectedLocation || camp.location === selectedLocation;
    const matchesDate = !selectedDate || camp.date === selectedDate;

    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedDate('');
  };

  return (
    <div className="container main-content" style={{ paddingTop: '2.5rem' }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <h1 className="section-title">{t('campsPage.title')}</h1>
        <p className="section-subtitle">{t('campsPage.subtitle')}</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="form-group">
          <label className="form-label">{t('campsPage.searchLabel')}</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder={t('campsPage.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Category Filter */}
        <div className="form-group">
          <label className="form-label">{t('campsPage.categoryFilter')}</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">{t('campsPage.allTypes')}</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.type}>
                {t(cat.key)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="form-group">
          <label className="form-label">{t('campsPage.locationFilter')}</label>
          <select
            className="form-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">{t('campsPage.allLocations')}</option>
            {locationsList.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="form-group">
          <label className="form-label">{t('campsPage.dateFilter')}</label>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <button className="btn btn-outline" onClick={clearFilters} style={{ height: '42px', padding: '0 1rem' }}>
          <RotateCcw size={16} /> {t('campsPage.clearFilters')}
        </button>
      </div>

      {/* Camps List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading health camps...
        </div>
      ) : filteredCamps.length === 0 ? (
        <div className="camp-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {t('campsPage.noMatch')}
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try resetting your search term or filters to discover available health camps.
          </p>
          <button className="btn btn-outline" onClick={clearFilters}>
            {t('campsPage.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid-camps">
          {filteredCamps.map((camp) => (
            <CampCard
              key={camp._id}
              camp={camp}
              onRegisterClick={(selected) => {
                if (!isUserLoggedIn) {
                  navigate('/login');
                  return;
                }
                setSelectedCampForReg(selected);
              }}
            />
          ))}
        </div>
      )}

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

export default HealthCamps;
