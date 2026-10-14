import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Upload, AlertCircle, Wrench } from 'lucide-react';
import { api } from '../services/api';

export const ResolveReportModal = ({ report, isOpen, onClose, onUpdated }) => {
  if (!isOpen || !report) return null;

  const [status, setStatus] = useState(report.status === 'Reported' ? 'Assigned' : report.status === 'Assigned' ? 'In Progress' : 'Resolved');
  const [resolutionNotes, setResolutionNotes] = useState(report.resolution_notes || '');
  const [estimatedHours, setEstimatedHours] = useState(report.estimated_hours || '2.0');
  const [statusNotes, setStatusNotes] = useState('');
  const [resolutionFile, setResolutionFile] = useState(null);
  const [preview, setPreview] = useState(report.resolution_image_url || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolutionFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('resolution_notes', resolutionNotes);
      if (estimatedHours) {
        formData.append('estimated_hours', estimatedHours);
      }
      if (statusNotes) {
        formData.append('notes', statusNotes);
      }
      if (resolutionFile) {
        formData.append('resolution_image', resolutionFile);
      }

      const res = await api.updateReport(report.id, formData);
      if (res.success) {
        onUpdated(res.data);
        onClose();
      } else {
        setError(res.error || 'Failed to update report status');
      }
    } catch (err) {
      console.error(err);
      setError('Network or server error while updating status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>Staff Status & Resolution Portal</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{
              background: 'var(--surface-sage)',
              border: '1px solid var(--border-emerald)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)' }}>ISSUE ID: {report.id}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {report.location}</span>
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--forest-surface)' }}>
                {report.title}
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Update Status *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${status === 'Assigned' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.8125rem', padding: '0.625rem 0.5rem' }}
                  onClick={() => setStatus('Assigned')}
                >
                  Assigned
                </button>
                <button
                  type="button"
                  className={`btn ${status === 'In Progress' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.8125rem', padding: '0.625rem 0.5rem', background: status === 'In Progress' ? '#6366f1' : undefined }}
                  onClick={() => setStatus('In Progress')}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`btn ${status === 'Resolved' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.8125rem', padding: '0.625rem 0.5rem' }}
                  onClick={() => setStatus('Resolved')}
                >
                  Resolved
                </button>
              </div>
            </div>

            {status === 'Resolved' && (
              <>
                <div className="form-group">
                  <label className="form-label">Resolution Details & Actions Taken *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe what repairs, cleaning, or replacements were performed..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Actual Time Spent (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="e.g. 2.5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Proof of Resolution Photo (After Repair)</label>
                  <label style={{
                    border: '2px dashed var(--border-emerald)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    background: 'var(--surface-sage)'
                  }}>
                    <Upload size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      Upload completion photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {preview && (
                    <div style={{ marginTop: '0.5rem', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-emerald)' }}>
                      <img src={preview} alt="Resolution" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Internal Status Log Note (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Parts arrived from central depot, beginning installation"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : `Save as ${status}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
