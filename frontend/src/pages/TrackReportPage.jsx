import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowLeft,
  Copy,
  Check,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRightCircle,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Sparkles,
  TreePine,
  Wrench,
  UserCheck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { api } from '../services/api';

const categoryLabels = {
  waste: 'Waste & Overflowing Dustbins',
  water_leakage: 'Water Leakage & Dripping Taps',
  electricity: 'Electricity Wastage',
  sanitation: 'Sanitation & Hygiene',
  other: 'Campus Environmental Issue'
};

const categoryIcons = {
  waste: '🗑️',
  water_leakage: '💧',
  electricity: '⚡',
  sanitation: '🧹',
  other: '🌱'
};

export const TrackReportPage = ({
  initialTrackId = '',
  onNavigateHome,
  onOpenCreate,
  onViewDetails,
  reports = []
}) => {
  const safeInitialId = typeof initialTrackId === 'string' ? initialTrackId.trim() : '';
  const [trackIdInput, setTrackIdInput] = useState(safeInitialId);
  const [currentReport, setCurrentReport] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedId, setSearchedId] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  // Search report by ID
  const handleSearch = async (idToSearch) => {
    const rawId = typeof idToSearch === 'string' ? idToSearch : (typeof trackIdInput === 'string' ? trackIdInput : '');
    const cleanId = rawId.replace(/^#+/, '').trim();
    if (!cleanId) return;

    setLoading(true);
    setNotFound(false);
    setSearchedId(cleanId);

    try {
      // 1. Try API fetch
      const res = await api.getReportById(cleanId);
      if (res && res.success && res.data && !Array.isArray(res.data)) {
        setCurrentReport(res.data);
        setStatusLogs(res.data.statusLogs || []);
        setNotFound(false);
        setLoading(false);
        return;
      }

      // 2. Fallback search in passed reports list
      const matched = (reports || []).find(r => {
        const rid = (r.id || '').toUpperCase();
        const cid = cleanId.toUpperCase();
        return (
          rid === cid ||
          rid.endsWith(`-${cid}`) ||
          rid.endsWith(cid) ||
          cid.endsWith(rid) ||
          (cid.length >= 3 && rid.includes(cid))
        );
      });

      if (matched) {
        setCurrentReport(matched);
        setNotFound(false);
        // fetch logs for matched
        try {
          const logsRes = await api.getStatusLogs(matched.id);
          if (logsRes && logsRes.success && Array.isArray(logsRes.data)) {
            setStatusLogs(logsRes.data);
          } else {
            setStatusLogs([]);
          }
        } catch (e) {
          setStatusLogs([]);
        }
      } else {
        setCurrentReport(null);
        setStatusLogs([]);
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error tracking report:', err);
      // Fallback in passed reports
      const matched = (reports || []).find(r => {
        const rid = (r.id || '').toUpperCase();
        const cid = cleanId.toUpperCase();
        return (
          rid === cid ||
          rid.endsWith(`-${cid}`) ||
          rid.endsWith(cid) ||
          (cid.length >= 3 && rid.includes(cid))
        );
      });
      if (matched) {
        setCurrentReport(matched);
        setNotFound(false);
      } else {
        setCurrentReport(null);
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Run on mount if initialTrackId is present
  useEffect(() => {
    if (typeof initialTrackId === 'string' && initialTrackId.trim()) {
      const cleanInit = initialTrackId.trim();
      setTrackIdInput(cleanInit);
      handleSearch(cleanInit);
    }
  }, [initialTrackId]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4-stage pipeline
  const pipelineSteps = [
    { key: 'Reported', label: 'Report Submitted', num: '01' },
    { key: 'Assigned', label: 'Triage & Assigned', num: '02' },
    { key: 'In Progress', label: 'Remediation Underway', num: '03' },
    { key: 'Resolved', label: 'Resolved & Verified', num: '04' }
  ];

  const currentStepIndex = currentReport
    ? pipelineSteps.findIndex(s => s.key === currentReport.status)
    : 0;

  return (
    <div className="track-page-container" style={{ minHeight: '85vh', background: 'var(--canvas-primary)', paddingBottom: '4rem' }}>
      {/* Top Header / Breadcrumb Bar */}
      <div className="track-subbar">
        <div className="track-subbar-inner">
          <button
            onClick={onNavigateHome}
            className="btn btn-outline track-subbar-back-btn"
          >
            <ArrowLeft size={16} />
            <span className="desktop-nav-text">Back to Campus Home</span>
            <span className="mobile-nav-text">Back to Home</span>
          </button>

          <div className="track-subbar-right">
            <span className="track-subbar-hint">Need to lodge a new hazard?</span>
            <button
              onClick={onOpenCreate}
              className="btn btn-primary track-subbar-create-btn"
            >
              <PlusCircle size={15} />
              <span className="desktop-nav-text">Report Issue</span>
              <span className="mobile-nav-text">Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="track-page-content" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.25rem' }}>
        {/* Hero Title Section */}
        <div className="track-hero">
          <div className="track-hero-badge">
            <ShieldCheck size={14} style={{ flexShrink: 0 }} />
            <span>Graphic Era Campus Issue Resolution Tracker</span>
          </div>

          <h1 className="track-hero-title">
            Track Your Report Status
          </h1>
          <p className="track-hero-subtitle">
            No account required. Enter your Tracking ID (provided when you submitted your complaint) to check inspection, technician assignment, and live repair progress.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="track-search-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="track-search-form"
          >
            <div className="track-search-input-wrap">
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Enter Tracking ID (e.g. ECO-2024-001 or ticket code)..."
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                style={{
                  paddingLeft: '42px',
                  height: '52px',
                  fontSize: '1rem',
                  borderRadius: 'var(--radius-md)',
                  width: '100%'
                }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary track-search-btn"
              disabled={loading || !(typeof trackIdInput === 'string' && trackIdInput.trim())}
            >
              <Search size={18} />
              <span>{loading ? 'Searching...' : 'Track Status'}</span>
            </button>
          </form>

          {/* Quick Helper / Demo ID Pills */}
          {reports.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                Recent Active Reports:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {reports.slice(0, 4).map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setTrackIdInput(r.id);
                      handleSearch(r.id);
                    }}
                    style={{
                      background: 'var(--surface-sage)',
                      border: '1px solid var(--border-emerald)',
                      color: 'var(--forest-dark)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>{r.id}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({r.status})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Not Found State */}
        {notFound && (
          <div
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              textAlign: 'center',
              marginBottom: '2.5rem'
            }}
          >
            <AlertCircle size={36} style={{ color: '#e11d48', margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#9f1239', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              No Report Found for "{searchedId}"
            </h3>
            <p style={{ color: '#be123c', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
              Please check your Tracking ID code. Tracking IDs are formatted like <strong>ECO-2024-XXX</strong>. You can also browse recent public reports below.
            </p>
            <button
              onClick={() => {
                setTrackIdInput('');
                setNotFound(false);
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.8125rem' }}
            >
              Clear & Try Again
            </button>
          </div>
        )}

        {/* Found Report Display Card */}
        {currentReport && (
          <div
            className="track-result-card"
            style={{
              background: 'var(--surface-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-emerald)',
              overflow: 'hidden',
              marginBottom: '3rem'
            }}
          >
            {/* Header with Tracking ID, Category & Live Status */}
            <div className="track-result-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      background: 'var(--forest-dark)',
                      color: 'white',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{currentReport.id}</span>
                    <button
                      onClick={() => copyToClipboard(currentReport.id)}
                      title="Copy Tracking ID"
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0, display: 'inline-flex' }}
                    >
                      {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
                    </button>
                  </div>
                  {copied && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Copied!
                    </span>
                  )}

                  <StatusBadge status={currentReport.status} />
                  <PriorityBadge priority={currentReport.priority} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-dark)', margin: 0 }}>
                  {currentReport.title}
                </h2>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Reported On</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  {new Date(currentReport.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="track-result-body" style={{ padding: '2rem 2rem 1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Remediation Progress
                </span>
              </div>

              <div className="status-flow-stepper" style={{ marginBottom: '1.5rem' }}>
                {pipelineSteps.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex || (currentReport.status === 'Resolved' && idx === currentStepIndex);
                  const isCurrent = idx === currentStepIndex && currentReport.status !== 'Resolved';

                  return (
                    <div
                      key={step.key}
                      className={`flow-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="flow-step-circle">
                        {isCompleted ? <CheckCircle2 size={16} /> : step.num}
                      </div>
                      <span className="flow-step-label" style={{ fontWeight: isCurrent || isCompleted ? 700 : 500 }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status Explanation Banner */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: currentReport.status === 'Resolved' ? '#ecfdf5' : currentReport.status === 'In Progress' ? '#f0f9ff' : currentReport.status === 'Assigned' ? '#fefce8' : '#faf5ff',
                  border: `1px solid ${currentReport.status === 'Resolved' ? '#a7f3d0' : currentReport.status === 'In Progress' ? '#bae6fd' : currentReport.status === 'Assigned' ? '#fef08a' : '#e9d5ff'}`,
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                {currentReport.status === 'Resolved' ? (
                  <CheckCircle2 size={22} style={{ color: '#059669', flexShrink: 0 }} />
                ) : currentReport.status === 'In Progress' ? (
                  <Clock size={22} style={{ color: '#0284c7', flexShrink: 0 }} />
                ) : currentReport.status === 'Assigned' ? (
                  <Wrench size={22} style={{ color: '#ca8a04', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={22} style={{ color: '#7e22ce', flexShrink: 0 }} />
                )}

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--forest-dark)' }}>
                    {currentReport.status === 'Resolved'
                      ? 'Issue Remediated & Verified'
                      : currentReport.status === 'In Progress'
                      ? 'Facilities Team On-Site: Work in Progress'
                      : currentReport.status === 'Assigned'
                      ? 'Assigned to Facility Department for Dispatch'
                      : 'Received & Logged into Campus Environmental Queue'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {currentReport.status === 'Resolved'
                      ? (currentReport.resolution_notes || 'All campus remediation actions have been concluded and verified by facilities.')
                      : currentReport.status === 'In Progress'
                      ? `Staff member ${currentReport.assignee?.full_name || 'Marcus Vance (Campus Facilities)'} is currently resolving this hazard on site.`
                      : currentReport.status === 'Assigned'
                      ? `Assigned to ${currentReport.assignee?.full_name || 'Facilities Operations'}. Team has received work order.`
                      : 'Triage officer is reviewing severity and will dispatch the appropriate campus maintenance crew shortly.'}
                  </div>
                </div>
              </div>

              {/* Grid: Details & Resolution */}
              <div className="track-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                {/* Left Card: Issue Overview */}
                <div style={{ background: 'var(--canvas-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--forest-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
                    Complaint Information
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>CAMPUS LOCATION</span>
                      <span style={{ fontWeight: 700, color: 'var(--forest-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} style={{ color: 'var(--primary)' }} />
                        {currentReport.location}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>CATEGORY</span>
                      <span style={{ fontWeight: 600, color: 'var(--forest-dark)' }}>
                        {categoryIcons[currentReport.category] || '🌱'} {categoryLabels[currentReport.category] || currentReport.category}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>DESCRIPTION</span>
                      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {currentReport.description}
                      </p>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>FILED BY</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {currentReport.reporter?.full_name || currentReport.reporter_name || 'Campus Community Member / Guest'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Assignment & Photos */}
                <div style={{ background: 'var(--canvas-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--forest-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
                    Facility Assignment & Proof
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>ASSIGNED TECHNICIAN</span>
                      <span style={{ fontWeight: 700, color: currentReport.assignee ? 'var(--forest-dark)' : 'var(--text-dim)' }}>
                        {currentReport.assignee ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <UserCheck size={14} style={{ color: 'var(--primary)' }} />
                            {currentReport.assignee.full_name} ({currentReport.assignee.department || 'Facilities Staff'})
                          </span>
                        ) : (
                          'Awaiting Triage Allocation'
                        )}
                      </span>
                    </div>

                    {currentReport.image_url && (
                      <div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>REPORT PHOTO</span>
                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                          <img
                            src={currentReport.image_url}
                            alt="Report evidence"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}

                    {currentReport.resolution_image_url && (
                      <div>
                        <span style={{ color: 'var(--primary)', fontSize: '0.75rem', display: 'block', fontWeight: 700, marginBottom: '0.35rem' }}>RESOLUTION VERIFICATION PHOTO</span>
                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-emerald)' }}>
                          <img
                            src={currentReport.resolution_image_url}
                            alt="Resolution evidence"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status History Logs (Audit Trail) */}
              {statusLogs.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                    Activity & Audit Trail
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {statusLogs.map((log, index) => (
                      <div
                        key={log.id || index}
                        style={{
                          fontSize: '0.8125rem',
                          background: 'white',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                          <span style={{ fontWeight: 700, color: 'var(--forest-dark)' }}>{log.new_status}</span>
                          <span style={{ color: 'var(--text-dim)' }}>— {log.notes}</span>
                        </div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div
              style={{
                background: 'var(--surface-sage)',
                padding: '1rem 2rem',
                borderTop: '1px solid var(--border-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <button
                onClick={() => {
                  setCurrentReport(null);
                  setTrackIdInput('');
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                Track Another ID
              </button>

              <button
                onClick={onOpenCreate}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <PlusCircle size={16} />
                <span>Report Another Issue</span>
              </button>
            </div>
          </div>
        )}

        {/* How Tracking Works Explainer */}
        {!currentReport && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3.5rem'
            }}
          >
            <div
              style={{
                background: 'var(--surface-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <PlusCircle size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                1. Report & Get Code
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Submit an issue anytime on campus. You are instantly given a unique Tracking ID (e.g. ECO-2024-001).
              </p>
            </div>

            <div
              style={{
                background: 'var(--surface-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.1)',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Search size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                2. Real-Time Tracking
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Enter your Tracking ID here without logging in. Check which technician has been assigned and when work begins.
              </p>
            </div>

            <div
              style={{
                background: 'var(--surface-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                3. Photographic Proof
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Once resolved, review inspection notes and verification photos confirming the hazard has been remediated.
              </p>
            </div>
          </div>
        )}

        {/* Public Campus Issues Transparent Directory */}
        {reports.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--forest-dark)', margin: 0 }}>
                  Recent Campus Environmental Reports
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                  Transparent live status of issues reported across Graphic Era campus.
                </p>
              </div>

              <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {reports.length} total reports tracked
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {reports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    background: 'var(--surface-primary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          background: 'var(--surface-sage)',
                          color: 'var(--forest-dark)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-emerald)'
                        }}
                      >
                        {report.id}
                      </span>
                      <StatusBadge status={report.status} />
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {report.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.location}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {report.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setTrackIdInput(report.id);
                      handleSearch(report.id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '0.45rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Search size={14} />
                    <span>Track This Issue</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
