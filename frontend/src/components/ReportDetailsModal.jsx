import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, User, Clock, CheckCircle2, AlertCircle, Star, History, ArrowRight, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryLabels = {
  waste: 'Waste & Overflowing Dustbins',
  water_leakage: 'Water Leakage & Dripping Taps',
  electricity: 'Electricity Wastage',
  sanitation: 'Sanitation & Hygiene',
  other: 'Other Campus Environmental Issues'
};

export const ReportDetailsModal = ({ report, isOpen, onClose, onOpenFeedback, onDeleteReport }) => {
  const { role } = useAuth();
  if (!isOpen || !report) return null;

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.getStatusLogs(report.id);
        if (res.success) {
          setLogs(res.data);
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [report.id]);

  // Status Pipeline Steps
  const steps = [
    { key: 'Reported', label: '01 Reported' },
    { key: 'Assigned', label: '02 Assigned' },
    { key: 'In Progress', label: '03 In Progress' },
    { key: 'Resolved', label: '04 Resolved' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === report.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="report-id-code" style={{ fontSize: '0.875rem' }}>{report.id}</span>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>{report.title}</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Progression Pipeline */}
          <div className="status-flow-stepper">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex || (report.status === 'Resolved' && idx === currentStepIndex);
              const isCurrent = idx === currentStepIndex && report.status !== 'Resolved';

              return (
                <div
                  key={step.key}
                  className={`flow-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="flow-step-circle">
                    {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="flow-step-label">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Core Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--canvas-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Category</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest-surface)' }}>{categoryLabels[report.category] || report.category}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Campus Location</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest-surface)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} style={{ color: 'var(--primary)' }} />
                {report.location}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Reported By</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest-surface)' }}>
                {report.reporter?.full_name || 'Alex Rivera (Student)'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Assigned Staff</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest-surface)' }}>
                {report.assignee?.full_name ? `${report.assignee.full_name}` : <span style={{ color: '#d97706' }}>Awaiting Assignment</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--forest-surface)', marginBottom: '0.4rem' }}>Problem Description</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, background: '#ffffff', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {report.description}
            </p>
          </div>

          {/* Photo Showcase (Issue Image vs Resolution Image) */}
          <div style={{ display: 'grid', gridTemplateColumns: report.resolution_image_url ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            {report.image_url && (
              <div>
                <h4 style={{ fontSize: '0.8125rem', color: 'var(--forest-surface)', marginBottom: '0.3rem' }}>Reported Issue Photo</h4>
                <div style={{ borderRadius: '8px', overflow: 'hidden', height: '180px', border: '1px solid var(--border-subtle)' }}>
                  <img src={report.image_url} alt="Reported issue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}

            {report.resolution_image_url && (
              <div>
                <h4 style={{ fontSize: '0.8125rem', color: '#047857', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={14} /> Resolution Proof Photo
                </h4>
                <div style={{ borderRadius: '8px', overflow: 'hidden', height: '180px', border: '1px solid var(--border-emerald)' }}>
                  <img src={report.resolution_image_url} alt="Resolution proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>

          {/* Resolution Details Card */}
          {report.status === 'Resolved' && (
            <div style={{
              background: 'var(--surface-mint)',
              border: '1px solid var(--border-emerald)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} /> Official Resolution Report
                </span>
                {report.estimated_hours && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--forest-dark)', background: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    Time spent: {report.estimated_hours} hrs
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {report.resolution_notes || 'Issue resolved by facilities maintenance team.'}
              </p>
            </div>
          )}

          {/* Student Feedback Showcase Card */}
          {report.feedback ? (
            <div style={{
              background: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={16} fill="#eab308" color="#eab308" /> Student Resolution Feedback
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#a16207' }}>
                  {report.feedback.satisfaction_rating} / 5 Stars
                </span>
              </div>

              <div className="form-grid-2" style={{ marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  <strong>Solved Properly: </strong>
                  <span style={{ textTransform: 'capitalize', color: report.feedback.is_properly_solved === 'yes' ? '#047857' : '#dc2626', fontWeight: 700 }}>
                    {report.feedback.is_properly_solved}
                  </span>
                </div>
                <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  <strong>Time Taken Rating: </strong>
                  <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>
                    {report.feedback.time_taken_rating?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {report.feedback.comments && (
                <div style={{ fontSize: '0.8125rem', color: '#713f12', fontStyle: 'italic', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  "{report.feedback.comments}"
                </div>
              )}
            </div>
          ) : report.status === 'Resolved' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.875rem 1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: 600 }}>
                This issue is marked Resolved. Have you verified the fix?
              </span>
              <button className="btn btn-primary btn-sm" style={{ background: '#d97706' }} onClick={() => { onClose(); onOpenFeedback(report); }}>
                Submit Feedback
              </button>
            </div>
          )}

          {/* Audit Logs Stream */}
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--forest-surface)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
              <History size={16} /> Status History & Audit Trail
            </h4>

            {loadingLogs ? (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', padding: '1rem 0' }}>Loading logs...</div>
            ) : (
              <div className="timeline-stream">
                {logs.map((log) => (
                  <div key={log.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--forest-dark)' }}>
                          {log.new_status}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>{log.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {role === 'admin' ? (
            <button
              className="btn btn-sm"
              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              onClick={() => {
                if (onDeleteReport) onDeleteReport(report);
              }}
            >
              <Trash2 size={14} />
              Delete Report
            </button>
          ) : <div />}

          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
