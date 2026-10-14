import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReportCard } from '../components/ReportCard';
import { MetricsGrid } from '../components/MetricsGrid';
import { Wrench, CheckCircle2, Clock, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { api } from '../services/api';

export const StaffDashboard = ({
  reports,
  metrics,
  onViewDetails,
  onOpenResolve,
  searchTerm,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('assigned_to_me');

  // Filter tasks
  const myAssignedReports = reports.filter(r => r.assigned_to === currentUser?.id);
  const unassignedReports = reports.filter(r => !r.assigned_to && r.status === 'Reported');

  let displayReports = myAssignedReports;
  if (activeTab === 'unassigned') {
    displayReports = unassignedReports;
  } else if (activeTab === 'in_progress') {
    displayReports = myAssignedReports.filter(r => r.status === 'In Progress');
  } else if (activeTab === 'resolved') {
    displayReports = myAssignedReports.filter(r => r.status === 'Resolved');
  }

  // Quick Self-Assign & Start Work handler
  const handleQuickClaim = async (reportId) => {
    try {
      const res = await api.updateReport(reportId, {
        assigned_to: currentUser.id,
        status: 'In Progress',
        notes: `Claimed and started work by ${currentUser.full_name}`
      });
      if (res.success) {
        onRefresh();
      }
    } catch (err) {
      console.error('Quick claim error:', err);
    }
  };

  return (
    <div>
      {/* Staff Hero Banner with GLITCHXGREEN */}
      <div className="dashboard-hero-banner" style={{
        background: 'linear-gradient(135deg, #022c22 0%, #047857 55%, #065f46 100%)',
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
        boxShadow: '0 12px 28px -6px rgba(4, 120, 87, 0.35)'
      }}>
        <div className="nature-leaf-particle anim-leaf-float" style={{ top: '15px', right: '40%', fontSize: '1.8rem' }}>🌿</div>
        <div className="nature-leaf-particle anim-sway" style={{ bottom: '15px', right: '25%', fontSize: '1.5rem' }}>🍃</div>

        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Wrench size={13} className="anim-pulse-glow" style={{ color: '#6ee7b7' }} />
            GLITCHXGREEN Operations & Maintenance
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 900 }}>
            Work Queue — {currentUser?.full_name}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#d1fae5', lineHeight: 1.55 }}>
            {currentUser?.department || 'Campus Facilities Team'}. Review student reports on GLITCHXGREEN, deploy campus repairs, and submit resolution proof.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {myAssignedReports.filter(r => r.status !== 'Resolved').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '0.25rem' }}>Active Tasks</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {myAssignedReports.filter(r => r.status === 'Resolved').length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '0.25rem' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* Campus Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-emerald)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'assigned_to_me' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('assigned_to_me')}
          >
            My Assigned Queue ({myAssignedReports.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'in_progress' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('in_progress')}
          >
            In Progress ({myAssignedReports.filter(r => r.status === 'In Progress').length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'unassigned' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('unassigned')}
          >
            Unassigned Campus Issues ({unassignedReports.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'resolved' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({myAssignedReports.filter(r => r.status === 'Resolved').length})
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      {displayReports.length === 0 ? (
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-emerald)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <CheckCircle2 size={36} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--forest-dark)', marginBottom: '0.25rem' }}>
            No tickets found in this tab
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            All clear! Check unassigned issues or look through previous resolved tickets.
          </p>
        </div>
      ) : (
        <div className="reports-grid">
          {displayReports.map((report) => (
            <div key={report.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <ReportCard
                report={report}
                onViewDetails={onViewDetails}
                onOpenResolve={onOpenResolve}
              />
              {/* Quick Staff Inline Bar if unassigned */}
              {!report.assigned_to && (
                <div style={{ marginTop: '-0.5rem', background: '#ecfdf5', padding: '0.625rem 1rem', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', border: '1px solid var(--border-emerald)', borderTop: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Unassigned campus report</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleQuickClaim(report.id)}
                  >
                    Claim & Start Fix
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
