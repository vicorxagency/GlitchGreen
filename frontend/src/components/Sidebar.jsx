import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Users,
  ShieldCheck,
  Wrench,
  FileText,
  BarChart3,
  Sparkles,
  TreePine,
  Home,
  QrCode
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenQRModal }) => {
  const { role } = useAuth();

  return (
    <aside className="app-sidebar">
      <div>
        {/* Navigation Categories */}
        <div className="sidebar-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div className="sidebar-category-header" style={{ marginBottom: 0 }}>
            {role === 'student' ? 'Student Workspace' : role === 'staff' ? 'Staff Operations' : role === 'admin' ? 'Administration' : 'Campus Workspace'}
          </div>
          <button
            onClick={() => setActiveTab('landing')}
            title="Return to GLITCHXGREEN Landing Page"
            style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Home size={12} />
            <span>Home</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
            title="Website Home"
          >
            <Home size={18} />
            <span className="sidebar-link-text desktop-nav-text">Website Home</span>
            <span className="sidebar-link-text mobile-nav-text">Home</span>
          </button>
          {role === 'student' && (
            <>
              <button
                className={`sidebar-link ${activeTab === 'student-my-reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('student-my-reports')}
                title="My Submitted Issues"
              >
                <ClipboardList size={18} />
                <span className="sidebar-link-text desktop-nav-text">My Submitted Issues</span>
                <span className="sidebar-link-text mobile-nav-text">My Reports</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'all-reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('all-reports')}
                title="All Campus Reports"
              >
                <TreePine size={18} />
                <span className="sidebar-link-text desktop-nav-text">All Campus Reports</span>
                <span className="sidebar-link-text mobile-nav-text">All Reports</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
                title="Campus Eco Statistics"
              >
                <BarChart3 size={18} />
                <span className="sidebar-link-text desktop-nav-text">Campus Eco Statistics</span>
                <span className="sidebar-link-text mobile-nav-text">Analytics</span>
              </button>
            </>
          )}

          {role === 'staff' && (
            <>
              <button
                className={`sidebar-link ${activeTab === 'staff-assigned' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff-assigned')}
                title="Assigned Work Queue"
              >
                <Wrench size={18} />
                <span className="sidebar-link-text desktop-nav-text">Assigned Work Queue</span>
                <span className="sidebar-link-text mobile-nav-text">Work Queue</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'all-reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('all-reports')}
                title="All Campus Reports"
              >
                <ClipboardList size={18} />
                <span className="sidebar-link-text desktop-nav-text">All Campus Reports</span>
                <span className="sidebar-link-text mobile-nav-text">All Reports</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
                title="Resolution Metrics"
              >
                <BarChart3 size={18} />
                <span className="sidebar-link-text desktop-nav-text">Resolution Metrics</span>
                <span className="sidebar-link-text mobile-nav-text">Analytics</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button
                className={`sidebar-link ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin-dashboard')}
                title="Admin Overview"
              >
                <LayoutDashboard size={18} />
                <span className="sidebar-link-text desktop-nav-text">Admin Overview</span>
                <span className="sidebar-link-text mobile-nav-text">Overview</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'all-reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('all-reports')}
                title="Report Management"
              >
                <ClipboardList size={18} />
                <span className="sidebar-link-text desktop-nav-text">Report Management</span>
                <span className="sidebar-link-text mobile-nav-text">Reports</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'admin-users' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin-users')}
                title="User & Role Directory"
              >
                <Users size={18} />
                <span className="sidebar-link-text desktop-nav-text">User & Role Directory</span>
                <span className="sidebar-link-text mobile-nav-text">Users</span>
              </button>

              <button
                className="sidebar-link"
                onClick={() => {
                  setActiveTab('admin-dashboard');
                  if (onOpenQRModal) onOpenQRModal();
                }}
                title="Generate Campus Report QR Code"
              >
                <QrCode size={18} style={{ color: 'var(--emerald)' }} />
                <span className="sidebar-link-text desktop-nav-text">Campus QR Studio</span>
                <span className="sidebar-link-text mobile-nav-text">QR Studio</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
                title="Sustainability Analytics"
              >
                <BarChart3 size={18} />
                <span className="sidebar-link-text desktop-nav-text">Sustainability Analytics</span>
                <span className="sidebar-link-text mobile-nav-text">Analytics</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* GLITCHXGREEN Campus Initiative Card */}
      <div className="sidebar-initiative-card" style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
        border: '1px solid var(--border-emerald)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.125rem',
        marginTop: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.4rem',
          color: 'var(--forest-dark)',
          fontWeight: 800,
          fontSize: '0.8125rem'
        }}>
          <Sparkles size={16} className="anim-pulse-glow" style={{ color: '#059669' }} />
          GLITCHXGREEN Action
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          Transforming campus sustainability through tech. Student reports divert waste and conserve water across campus daily.
        </p>
      </div>
    </aside>
  );
};
