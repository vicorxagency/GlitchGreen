import React, { useState, useEffect } from 'react';
import { X, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const AssignStaffModal = ({ report, isOpen, onClose, onAssigned }) => {
  if (!isOpen || !report) return null;

  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(report.assigned_to || '');
  const [priority, setPriority] = useState(report.priority || 'Medium');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.getUsers('staff');
        if (res.success) {
          setStaffList(res.data);
          if (!selectedStaff && res.data.length > 0) {
            setSelectedStaff(res.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      setError('Please select a campus staff member.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.assignReport(report.id, {
        assigned_to: selectedStaff,
        priority,
        notes: notes.trim()
      });

      if (res.success) {
        onAssigned(res.data);
        onClose();
      } else {
        setError(res.error || 'Failed to assign staff');
      }
    } catch (err) {
      console.error(err);
      setError('Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--forest-dark)' }} />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>Admin Staff Assignment</h2>
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
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                ASSIGNING: {report.id}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--forest-surface)' }}>
                {report.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Location: {report.location}
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Assign Responsible Campus Staff *</label>
              <select
                className="form-select"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
              >
                <option value="">-- Select Campus Personnel --</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} — {st.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Operational Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Special Dispatch Notes / Directives (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Please bring replacement pipe fittings or safety perimeter tape..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
