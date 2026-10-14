import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MetricsGrid } from '../components/MetricsGrid';
import { ReportCard } from '../components/ReportCard';
import { GenerateQRModal } from '../components/GenerateQRModal';
import { ShieldCheck, Users, Wrench, AlertTriangle, CheckCircle, Star, ArrowRight, QrCode, Sparkles } from 'lucide-react';

export const AdminDashboard = ({
  reports,
  metrics,
  users,
  onViewDetails,
  onOpenAssign,
  onOpenResolve,
  onDeleteReport,
  setActiveTab,
  onOpenQRModal
}) => {
  const { currentUser } = useAuth();
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleOpenQR = () => {
    if (onOpenQRModal) {
      onOpenQRModal();
    } else {
      setQrModalOpen(true);
    }
  };

  const unassignedReports = reports.filter(r => !r.assigned_to && r.status === 'Reported');
  const staffUsers = users.filter(u => u.role === 'staff');

  return (
    <div>
      {/* Admin Executive Header with GLITCHXGREEN */}
      <div className="dashboard-hero-banner" style={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem 2.5rem',
        color: 'white',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 28px -6px rgba(2, 44, 34, 0.45)'
      }}>
        <div className="nature-leaf-particle anim-leaf-float" style={{ top: '15px', right: '35%', fontSize: '2rem' }}>🌿</div>
        <div className="nature-leaf-particle anim-sway" style={{ bottom: '20px', right: '15%', fontSize: '1.6rem' }}>🍃</div>

        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShieldCheck size={13} className="anim-pulse-glow" style={{ color: '#6ee7b7' }} />
            GLITCHXGREEN Executive Command & Oversight
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 900 }}>
            {currentUser?.full_name || 'Dr. Evelyn Hayes'}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#d1fae5', lineHeight: 1.55 }}>
            Office of Campus Sustainability & Facilities Governance. Full access to GLITCHXGREEN user management, staff workload oversight, and campus sustainability KPIs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{ background: '#10b981', color: '#ffffff', fontWeight: 700, border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            onClick={handleOpenQR}
            title="Generate QR code for campus signage to direct students to the report form"
          >
            <QrCode size={16} />
            <span>Generate Report QR</span>
          </button>
          <button
            className="btn"
            style={{ background: '#ffffff', color: '#064e3b', fontWeight: 700 }}
            onClick={() => setActiveTab('admin-users')}
          >
            <Users size={16} />
            User Directory
          </button>
          <button
            className="btn btn-secondary"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={() => setActiveTab('all-reports')}
          >
            All Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricsGrid metrics={metrics} />

      {/* Admin Grid: Staff Workload + Urgent / Unassigned Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Staff Management / Workload Card */}
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-emerald)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={18} style={{ color: 'var(--primary)' }} />
              Staff Workload & Assignment
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              {staffUsers.length} Active Staff
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {staffUsers.map((staff) => {
              const assignedCount = reports.filter(r => r.assigned_to === staff.id && r.status !== 'Resolved').length;
              const completedCount = reports.filter(r => r.assigned_to === staff.id && r.status === 'Resolved').length;

              return (
                <div key={staff.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--canvas-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={staff.avatar_url} alt={staff.full_name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-surface)' }}>{staff.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{staff.department}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {assignedCount} active
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                      {completedCount} resolved
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unassigned Issues Requiring Attention */}
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-emerald)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              Awaiting Staff Assignment ({unassignedReports.length})
            </h3>
          </div>

          {unassignedReports.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              All reported campus incidents have been assigned to maintenance staff!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {unassignedReports.slice(0, 3).map((rep) => (
                <div key={rep.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400e' }}>{rep.id}: {rep.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rep.location}</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: '#d97706', borderColor: '#d97706' }}
                    onClick={() => onOpenAssign(rep)}
                  >
                    Assign Staff
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus Spot QR Code Generator Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7ef 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-emerald)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <QrCode size={18} style={{ color: 'var(--primary)' }} />
                <span>Campus Spot QR Dispatcher</span>
              </h3>
              <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid #bbf7d0' }}>
                DIRECT SCAN
              </span>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Generate printable QR codes and stickers for cafeterias, labs, and bus stops. When students scan with any phone camera, it immediately opens the report section with the location pre-filled!
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {['Cafeteria', 'CS Block', 'Library', 'Hostels', 'Sports Complex'].map(tag => (
                <span key={tag} style={{ fontSize: '0.72rem', background: 'white', color: 'var(--forest-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-emerald)', fontWeight: 600 }}>
                  📍 {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}
            onClick={handleOpenQR}
          >
            <QrCode size={16} />
            <span>Open QR Code Studio & Print</span>
          </button>
        </div>
      </div>

      {/* Recent Campus Issues Overview */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>Live Campus Incident Feed</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>All reports across campus buildings</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('all-reports')}>
          View Full Report Catalog <ArrowRight size={14} />
        </button>
      </div>

      <div className="reports-grid">
        {reports.slice(0, 6).map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onViewDetails={onViewDetails}
            onOpenAssign={onOpenAssign}
            onOpenResolve={onOpenResolve}
            onDeleteReport={onDeleteReport}
          />
        ))}
      </div>

      {/* Generate QR Modal */}
      <GenerateQRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
};
