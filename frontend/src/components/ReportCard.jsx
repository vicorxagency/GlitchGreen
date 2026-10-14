import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MapPin, User, Calendar, Star, Wrench, Shield, CheckCircle2, Trash2 } from 'lucide-react';

const categoryLabels = {
  waste: 'Waste & Littering',
  water_leakage: 'Water Leakage',
  electricity: 'Electricity Wastage',
  sanitation: 'Sanitation & Hygiene',
  other: 'Other Campus Issue'
};

export const ReportCard = ({
  report,
  onViewDetails,
  onOpenFeedback,
  onOpenResolve,
  onOpenAssign,
  onDeleteReport
}) => {
  const { role, currentUser } = useAuth();

  const isResolved = report.status === 'Resolved';
  const hasFeedback = Boolean(report.feedback);
  const isReporter = currentUser && report.reported_by === currentUser.id;

  return (
    <div className="report-card">
      {/* Media thumbnail */}
      <div className="report-card-media" onClick={() => onViewDetails(report)} style={{ cursor: 'pointer' }}>
        {report.image_url ? (
          <img src={report.image_url} alt={report.title} onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80';
          }} />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            Campus Issue Notice
          </div>
        )}

        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <PriorityBadge priority={report.priority} />
        </div>

        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="report-card-body">
        <div className="report-id-row">
          <span className="report-id-code">{report.id}</span>
          <span className="badge-category">{categoryLabels[report.category] || report.category}</span>
        </div>

        <h3
          className="report-card-title"
          onClick={() => onViewDetails(report)}
          style={{ cursor: 'pointer' }}
          title={report.title}
        >
          {report.title}
        </h3>

        <p className="report-card-desc">{report.description}</p>

        <div className="report-meta-row">
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {report.location}
          </span>
        </div>

        <div className="report-meta-row">
          <Calendar size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <span>{new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          {report.assignee && (
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--forest-dark)', fontWeight: 600 }}>
              <User size={12} />
              {report.assignee.full_name}
            </span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="report-card-footer">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onViewDetails(report)}
          >
            Details & Logs
          </button>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {/* Student Feedback Actions */}
            {isResolved && (
              hasFeedback ? (
                <button
                  className="btn btn-sm"
                  style={{ background: '#fef3c7', color: '#92400E', border: '1px solid #fde68a' }}
                  onClick={() => onViewDetails(report)}
                  title="Feedback already received"
                >
                  <Star size={13} fill="#d97706" />
                  {report.feedback.satisfaction_rating}★ Feedback
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: '#d97706', borderColor: '#d97706' }}
                  onClick={() => onOpenFeedback(report)}
                  title="Give feedback on how this was resolved and time taken"
                >
                  <Star size={13} />
                  Rate Fix
                </button>
              )
            )}

            {/* Staff Actions */}
            {role === 'staff' && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenResolve(report)}
                title="Update status or resolve issue"
              >
                <Wrench size={13} />
                Update
              </button>
            )}

            {/* Admin Actions */}
            {role === 'admin' && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenAssign(report)}
                  title="Assign to staff member"
                >
                  <Shield size={13} />
                  {report.assigned_to ? 'Reassign' : 'Assign'}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onOpenResolve(report)}
                  title="Update status"
                >
                  Status
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteReport) onDeleteReport(report);
                  }}
                  title="Permanently delete this report"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
