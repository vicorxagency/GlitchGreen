import React, { useState } from 'react';
import { X, Star, CheckCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const FeedbackModal = ({ report, isOpen, onClose, onFeedbackSubmitted }) => {
  if (!isOpen || !report) return null;

  const [isProperlySolved, setIsProperlySolved] = useState('yes');
  const [satisfactionRating, setSatisfactionRating] = useState(5);
  const [timeTakenRating, setTimeTakenRating] = useState('acceptable');
  const [comments, setComments] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const ratingDescriptions = {
    1: 'Very Unsatisfied (Ineffective resolution)',
    2: 'Unsatisfied (Multiple issues remain)',
    3: 'Neutral (Acceptable fix)',
    4: 'Satisfied (Good resolution)',
    5: 'Extremely Satisfied (Prompt & complete fix!)'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.submitFeedback({
        report_id: report.id,
        is_properly_solved: isProperlySolved,
        satisfaction_rating: satisfactionRating,
        time_taken_rating: timeTakenRating,
        comments: comments.trim()
      });

      if (res.success) {
        onFeedbackSubmitted(res.data);
        onClose();
      } else {
        setError(res.error || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error(err);
      setError('Network or server error while submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }}></span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>GLITCHX<span style={{ color: '#059669' }}>GREEN</span> Resolution Feedback</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Target Report Summary */}
            <div style={{
              background: 'var(--surface-sage)',
              border: '1px solid var(--border-emerald)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.2rem' }}>
                RESOLVED ISSUE: {report.id}
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--forest-surface)' }}>
                {report.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Location: {report.location}
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Question 1: Was problem solved properly? */}
            <div className="form-group">
              <label className="form-label">1. Was the problem solved properly?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <label style={{
                  border: `2px solid ${isProperlySolved === 'yes' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: isProperlySolved === 'yes' ? 'var(--primary-light)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="isProperlySolved"
                    value="yes"
                    checked={isProperlySolved === 'yes'}
                    onChange={(e) => setIsProperlySolved(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.25rem' }}>✅</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--forest-surface)' }}>Yes, Fully Solved</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>No issues remain</span>
                </label>

                <label style={{
                  border: `2px solid ${isProperlySolved === 'partially' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: isProperlySolved === 'partially' ? 'var(--primary-light)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="isProperlySolved"
                    value="partially"
                    checked={isProperlySolved === 'partially'}
                    onChange={(e) => setIsProperlySolved(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--forest-surface)' }}>Partially Fixed</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Minor flaw persists</span>
                </label>

                <label style={{
                  border: `2px solid ${isProperlySolved === 'no' ? '#dc2626' : 'var(--border-subtle)'}`,
                  background: isProperlySolved === 'no' ? '#fee2e2' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="isProperlySolved"
                    value="no"
                    checked={isProperlySolved === 'no'}
                    onChange={(e) => setIsProperlySolved(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.25rem' }}>❌</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--forest-surface)' }}>Not Solved</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Problem unresolved</span>
                </label>
              </div>
            </div>

            {/* Question 2: Satisfaction Star Rating */}
            <div className="form-group">
              <label className="form-label">2. Overall Satisfaction Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="star-rating-group">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-rating-btn ${((hoverRating || satisfactionRating) >= star) ? 'filled' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSatisfactionRating(star)}
                    >
                      <Star size={26} fill={(hoverRating || satisfactionRating) >= star ? '#eab308' : 'none'} />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-dark)', marginLeft: '0.5rem' }}>
                  {satisfactionRating} / 5
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {ratingDescriptions[hoverRating || satisfactionRating]}
              </div>
            </div>

            {/* Question 3: Time taken to fix */}
            <div className="form-group">
              <label className="form-label">3. How much time did it take to fix?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <label style={{
                  border: `2px solid ${timeTakenRating === 'faster_than_expected' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: timeTakenRating === 'faster_than_expected' ? 'var(--primary-light)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  <input
                    type="radio"
                    name="timeTakenRating"
                    value="faster_than_expected"
                    checked={timeTakenRating === 'faster_than_expected'}
                    onChange={(e) => setTimeTakenRating(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Faster than Expected</span>
                </label>

                <label style={{
                  border: `2px solid ${timeTakenRating === 'acceptable' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  background: timeTakenRating === 'acceptable' ? 'var(--primary-light)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  <input
                    type="radio"
                    name="timeTakenRating"
                    value="acceptable"
                    checked={timeTakenRating === 'acceptable'}
                    onChange={(e) => setTimeTakenRating(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.1rem' }}>⏱️</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Reasonable / On Time</span>
                </label>

                <label style={{
                  border: `2px solid ${timeTakenRating === 'too_slow' ? '#ea580c' : 'var(--border-subtle)'}`,
                  background: timeTakenRating === 'too_slow' ? '#ffedd5' : 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.625rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  <input
                    type="radio"
                    name="timeTakenRating"
                    value="too_slow"
                    checked={timeTakenRating === 'too_slow'}
                    onChange={(e) => setTimeTakenRating(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.1rem' }}>⌛</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Too Slow / Delayed</span>
                </label>
              </div>
            </div>

            {/* Question 4: Comments */}
            <div className="form-group">
              <label className="form-label">Student Comments / Notes on Resolution (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Share any remarks on the quality of repair or cleanup..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Recording Feedback...' : 'Submit Resolution Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
