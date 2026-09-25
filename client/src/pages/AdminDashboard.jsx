import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle,
  Users,
  Activity,
  Plus,
  Edit,
  Trash2,
  Ban,
  Eye,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminCamps,
  fetchAdminRegistrations,
  deleteCampApi,
  cancelCampApi
} from '../services/api';
import AdminCampModal from '../components/AdminCampModal';

const AdminDashboard = () => {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('camps'); // 'camps' | 'registrations'

  const [camps, setCamps] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Camp Modal state
  const [editingCamp, setEditingCamp] = useState(null);
  const [showCampModal, setShowCampModal] = useState(false);

  // Registrations Filter & Search state
  const [selectedCampFilter, setSelectedCampFilter] = useState('');
  const [regSearchQuery, setRegSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [isLoggedIn, token]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [campsData, regData] = await Promise.all([
        fetchAdminCamps(token),
        fetchAdminRegistrations(token)
      ]);
      setCamps(campsData);
      setRegistrations(regData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      setLoading(false);
    }
  };

  // Metrics Calculations
  const upcomingCount = camps.filter(c => c.status === 'Upcoming').length;
  const completedCount = camps.filter(c => c.status === 'Completed').length;
  const activeCount = upcomingCount;
  const totalRegistrations = registrations.length;

  // Actions
  const handleCancelCamp = async (campId) => {
    if (window.confirm('Are you sure you want to cancel this health camp? Citizens will no longer be able to register.')) {
      try {
        await cancelCampApi(token, campId);
        loadDashboardData();
      } catch (err) {
        alert(err.message || 'Error cancelling camp');
      }
    }
  };

  const handleDeleteCamp = async (campId) => {
    if (window.confirm('Are you sure you want to PERMANENTLY DELETE this health camp and all its registrations? This cannot be undone.')) {
      try {
        await deleteCampApi(token, campId);
        loadDashboardData();
      } catch (err) {
        alert(err.message || 'Error deleting camp');
      }
    }
  };

  // Registration Filtered List
  const filteredRegistrations = registrations.filter(reg => {
    const matchesCamp = !selectedCampFilter || (reg.campId && reg.campId._id === selectedCampFilter);
    const q = regSearchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      reg.fullName.toLowerCase().includes(q) ||
      reg.mobileNumber.includes(q) ||
      reg.registrationId.toLowerCase().includes(q) ||
      (reg.campId && reg.campId.campNameEnglish.toLowerCase().includes(q))
    );
    return matchesCamp && matchesQuery;
  });

  return (
    <div className="container main-content" style={{ paddingTop: '2.5rem' }}>
      {/* Header & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Manage free community health camps and citizen registrations</p>
        </div>
        <button className="btn btn-outline" onClick={loadDashboardData}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-number">{upcomingCount}</div>
            <div className="stat-label">Upcoming Camps</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed Camps</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{totalRegistrations}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">Active Camps</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1rem' }}>
        <button
          onClick={() => setActiveTab('camps')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: '700',
            fontSize: '1rem',
            border: 'none',
            borderBottom: activeTab === 'camps' ? '3px solid var(--accent-blue)' : '3px solid transparent',
            color: activeTab === 'camps' ? 'var(--accent-blue)' : 'var(--text-muted)',
            background: 'none'
          }}
        >
          Manage Health Camps ({camps.length})
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: '700',
            fontSize: '1rem',
            border: 'none',
            borderBottom: activeTab === 'registrations' ? '3px solid var(--accent-blue)' : '3px solid transparent',
            color: activeTab === 'registrations' ? 'var(--accent-blue)' : 'var(--text-muted)',
            background: 'none'
          }}
        >
          Manage Registrations ({registrations.length})
        </button>
      </div>

      {/* TAB 1: MANAGE HEALTH CAMPS */}
      {activeTab === 'camps' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>Health Camps List</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingCamp(null);
                setShowCampModal(true);
              }}
            >
              <Plus size={18} /> Add Health Camp
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading camps...</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Camp Name</th>
                    <th>Camp Type</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {camps.map((camp) => (
                    <tr key={camp._id}>
                      <td style={{ fontWeight: '600' }}>
                        <div>{camp.campNameEnglish}</div>
                        {camp.campNameTelugu && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{camp.campNameTelugu}</div>
                        )}
                      </td>
                      <td>{camp.campType}</td>
                      <td>{camp.date}</td>
                      <td>{camp.location}</td>
                      <td>
                        <strong>{camp.registeredParticipants}</strong> / {camp.maxParticipants}
                      </td>
                      <td>
                        <span className={`status-badge status-${camp.status}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            title="View Public Page"
                            onClick={() => navigate(`/camps/${camp._id}`)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#0284c7' }}
                            title="Edit Camp"
                            onClick={() => {
                              setEditingCamp(camp);
                              setShowCampModal(true);
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          {camp.status === 'Upcoming' && (
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#d97706' }}
                              title="Cancel Camp"
                              onClick={() => handleCancelCamp(camp._id)}
                            >
                              <Ban size={14} />
                            </button>
                          )}
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ef4444' }}
                            title="Delete Camp"
                            onClick={() => handleDeleteCamp(camp._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div>
          {/* Filters Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Search Registrations</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Search by Citizen Name, Mobile, Reg ID..."
                  value={regSearchQuery}
                  onChange={(e) => setRegSearchQuery(e.target.value)}
                />
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Filter by Camp</label>
              <select
                className="form-select"
                value={selectedCampFilter}
                onChange={(e) => setSelectedCampFilter(e.target.value)}
              >
                <option value="">All Camps</option>
                {camps.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.campNameEnglish} ({c.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading registrations...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="camp-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No citizen registrations found matching filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Citizen Name</th>
                    <th>Age / Gender</th>
                    <th>Mobile Number</th>
                    <th>Camp Name</th>
                    <th>Address</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>
                        {reg.registrationId}
                      </td>
                      <td style={{ fontWeight: '600' }}>{reg.fullName}</td>
                      <td>{reg.age} Yrs / {reg.gender}</td>
                      <td>{reg.mobileNumber}</td>
                      <td>
                        {reg.campId ? reg.campId.campNameEnglish : <em style={{ color: 'var(--text-muted)' }}>Deleted Camp</em>}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{reg.address}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Admin Add/Edit Camp Modal */}
      {showCampModal && (
        <AdminCampModal
          camp={editingCamp}
          onClose={() => {
            setShowCampModal(false);
            setEditingCamp(null);
          }}
          onSuccess={() => {
            setShowCampModal(false);
            setEditingCamp(null);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
