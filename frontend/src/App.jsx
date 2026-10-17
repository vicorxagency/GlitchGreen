import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CreateReportModal } from './components/CreateReportModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ResolveReportModal } from './components/ResolveReportModal';
import { AssignStaffModal } from './components/AssignStaffModal';
import { ReportDetailsModal } from './components/ReportDetailsModal';
import { GenerateQRModal } from './components/GenerateQRModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TrackReportPage } from './pages/TrackReportPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ReportsCatalog } from './pages/ReportsCatalog';
import { UserManagement } from './pages/UserManagement';
import { CampusAnalytics } from './pages/CampusAnalytics';

export const App = () => {
  const { role, currentUser } = useAuth();

  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('waste');
  const [trackReportId, setTrackReportId] = useState('');
  const [prefilledLocation, setPrefilledLocation] = useState('');

  // Handle direct QR code scans: e.g. /?action=report&location=Cafeteria&category=waste
  useEffect(() => {
    const handleUrlParams = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        const reportParam = params.get('report');
        if (action === 'report' || reportParam === 'true' || window.location.hash === '#report') {
          const loc = params.get('location');
          const cat = params.get('category');
          if (loc) setPrefilledLocation(decodeURIComponent(loc));
          if (cat) setSelectedCategory(decodeURIComponent(cat));
          setCreateModalOpen(true);
        }
      } catch (err) {
        console.error('Error parsing QR scan URL params:', err);
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, []);

  // Active Tab: Default to 'landing' for the interactive landing page
  const [activeTab, setActiveTab] = useState('landing');

  // Sync default tab whenever the user switches role, only if not currently on landing/login/register
  useEffect(() => {
    if (activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register') {
      if (role === 'student') {
        setActiveTab('student-my-reports');
      } else if (role === 'staff') {
        setActiveTab('staff-assigned');
      } else if (role === 'admin') {
        setActiveTab('admin-dashboard');
      }
    }
  }, [role]);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState(null);
  const [resolveReport, setResolveReport] = useState(null);
  const [assignReport, setAssignReport] = useState(null);
  const [detailsReport, setDetailsReport] = useState(null);
  const [adminQrModalOpen, setAdminQrModalOpen] = useState(false);

  // Data fetching
  const refreshData = async () => {
    try {
      const [repRes, metRes, usrRes] = await Promise.all([
        api.getReports(),
        api.getMetrics(),
        api.getUsers()
      ]);

      if (repRes.success) setReports(repRes.data);
      if (metRes.success) setMetrics(metRes.data);
      if (usrRes.success) setUsers(usrRes.data);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser, activeTab]);

  // Handlers for state updates
  const handleReportCreated = (newReport) => {
    refreshData();
  };

  const handleReportUpdated = () => {
    refreshData();
  };

  const handleFeedbackSubmitted = () => {
    refreshData();
  };

  const handleDeleteReport = async (report) => {
    if (!report?.id) return;
    const confirmed = window.confirm(`Are you sure you want to permanently delete report ${report.id} ("${report.title}")? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await api.deleteReport(report.id);
      if (res.success) {
        if (detailsReport?.id === report.id) {
          setDetailsReport(null);
        }
        await refreshData();
      } else {
        alert(res.error || 'Failed to delete report.');
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Network or server error while deleting report.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* 1. Top Navigation */}
      <Navbar
        onOpenCreateModal={() => {
          setSelectedCategory('waste');
          setCreateModalOpen(true);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 3. Core View: Landing Page / Login / Register / Role Workspace */}
      {activeTab === 'landing' ? (
        <LandingPage
          metrics={metrics}
          reports={reports}
          onOpenCreate={(catId) => {
            if (catId) setSelectedCategory(catId);
            setCreateModalOpen(true);
          }}
          onViewDetails={(rep) => setDetailsReport(rep)}
          onNavigateTrack={(repId) => {
            const cleanId = typeof repId === 'string' ? repId.trim() : '';
            setTrackReportId(cleanId);
            setActiveTab('track');
          }}
        />
      ) : activeTab === 'track' ? (
        <TrackReportPage
          initialTrackId={trackReportId}
          onNavigateHome={() => setActiveTab('landing')}
          onOpenCreate={(catId) => {
            if (catId) setSelectedCategory(catId);
            setCreateModalOpen(true);
          }}
          onViewDetails={(rep) => setDetailsReport(rep)}
          reports={reports}
        />
      ) : activeTab === 'login' ? (
        <LoginPage
          onNavigateRegister={() => setActiveTab('register')}
          onNavigateHome={() => setActiveTab('landing')}
          onLoginSuccess={(user) => {
            refreshData();
            setActiveTab(user?.role === 'student' ? 'student-my-reports' : user?.role === 'staff' ? 'staff-assigned' : 'admin-dashboard');
          }}
        />
      ) : activeTab === 'register' ? (
        <RegisterPage
          onNavigateLogin={() => setActiveTab('login')}
          onNavigateHome={() => setActiveTab('landing')}
          onRegisterSuccess={(user) => {
            refreshData();
            setActiveTab('student-my-reports');
          }}
        />
      ) : (
        <div className="app-layout">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQRModal={() => setAdminQrModalOpen(true)}
          />

          <main className="main-content">
            <div className="page-wrapper">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '320px', gap: '0.75rem' }}>
                  <div className="anim-pulse-glow" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #064e3b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                    🌱
                  </div>
                  <div style={{ color: 'var(--forest-dark)', fontWeight: 800, fontSize: '1.1rem' }}>
                    GLITCHX<span style={{ color: '#059669' }}>GREEN</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    Loading Campus Climate Tech Platform...
                  </div>
                </div>
              ) : (
                <>
                  {/* Student Views */}
                  {activeTab === 'student-my-reports' && (
                    <StudentDashboard
                      reports={reports}
                      metrics={metrics}
                      onOpenCreate={() => {
                        setSelectedCategory('waste');
                        setCreateModalOpen(true);
                      }}
                      onViewDetails={(rep) => setDetailsReport(rep)}
                      onOpenFeedback={(rep) => setFeedbackReport(rep)}
                      searchTerm={searchTerm}
                    />
                  )}

                  {/* Staff Views */}
                  {activeTab === 'staff-assigned' && (
                    <StaffDashboard
                      reports={reports}
                      metrics={metrics}
                      onViewDetails={(rep) => setDetailsReport(rep)}
                      onOpenResolve={(rep) => setResolveReport(rep)}
                      searchTerm={searchTerm}
                      onRefresh={refreshData}
                    />
                  )}

                  {/* Admin Views */}
                  {activeTab === 'admin-dashboard' && (
                    <AdminDashboard
                      reports={reports}
                      metrics={metrics}
                      users={users}
                      onViewDetails={(rep) => setDetailsReport(rep)}
                      onOpenAssign={(rep) => setAssignReport(rep)}
                      onOpenResolve={(rep) => setResolveReport(rep)}
                      onDeleteReport={handleDeleteReport}
                      setActiveTab={setActiveTab}
                      onOpenQRModal={() => setAdminQrModalOpen(true)}
                    />
                  )}

                  {/* Universal Views */}
                  {activeTab === 'all-reports' && (
                    <ReportsCatalog
                      reports={reports}
                      onViewDetails={(rep) => setDetailsReport(rep)}
                      onOpenFeedback={(rep) => setFeedbackReport(rep)}
                      onOpenResolve={(rep) => setResolveReport(rep)}
                      onOpenAssign={(rep) => setAssignReport(rep)}
                      onDeleteReport={handleDeleteReport}
                      onOpenCreate={() => {
                        setSelectedCategory('waste');
                        setCreateModalOpen(true);
                      }}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />
                  )}

                  {activeTab === 'admin-users' && (
                    <UserManagement
                      users={users}
                      onRefreshUsers={refreshData}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <CampusAnalytics
                      metrics={metrics}
                      reports={reports}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {/* GLITCHXGREEN Hackathon Footer */}
      <Footer />

      {/* Interactive Modals */}
      <CreateReportModal
        isOpen={createModalOpen}
        initialCategory={selectedCategory}
        initialLocation={prefilledLocation}
        onClose={() => {
          setCreateModalOpen(false);
          setPrefilledLocation('');
        }}
        onCreated={handleReportCreated}
        onNavigateTrack={(repId) => {
          setCreateModalOpen(false);
          setPrefilledLocation('');
          setTrackReportId(repId || '');
          setActiveTab('track');
        }}
      />

      <FeedbackModal
        report={feedbackReport}
        isOpen={Boolean(feedbackReport)}
        onClose={() => setFeedbackReport(null)}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      <ResolveReportModal
        report={resolveReport}
        isOpen={Boolean(resolveReport)}
        onClose={() => setResolveReport(null)}
        onUpdated={handleReportUpdated}
      />

      <AssignStaffModal
        report={assignReport}
        isOpen={Boolean(assignReport)}
        onClose={() => setAssignReport(null)}
        onAssigned={handleReportUpdated}
      />

      <ReportDetailsModal
        report={detailsReport}
        isOpen={Boolean(detailsReport)}
        onClose={() => setDetailsReport(null)}
        onDeleteReport={handleDeleteReport}
        onOpenFeedback={(rep) => {
          setDetailsReport(null);
          setFeedbackReport(rep);
        }}
      />

      {/* Campus Spot QR Code Studio for Admin */}
      <GenerateQRModal
        isOpen={adminQrModalOpen}
        onClose={() => setAdminQrModalOpen(false)}
      />
    </div>
  );
};

export default App;
