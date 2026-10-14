import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, AlertCircle, Check, Copy, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreateReportModal = ({
  isOpen,
  onClose,
  onCreated,
  onNavigateTrack,
  initialCategory = 'waste',
  initialLocation = ''
}) => {
  if (!isOpen) return null;

  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory || 'waste');
  const [location, setLocation] = useState(initialLocation || '');
  const [priority, setPriority] = useState('Medium');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdReport, setCreatedReport] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (initialLocation && isOpen) {
      setLocation(initialLocation);
    }
  }, [initialLocation, isOpen]);

  // Reset when closing
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setImageFile(null);
    setImagePreview('');
    setCreatedReport(null);
    setError('');
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please provide title, description, and campus location.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('location', location.trim());
      formData.append('priority', priority);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (!currentUser) {
        if (reporterName.trim()) formData.append('reporter_name', reporterName.trim());
        if (reporterEmail.trim()) formData.append('reporter_email', reporterEmail.trim());
      }

      const res = await api.createReport(formData);
      if (res.success && res.data) {
        setCreatedReport(res.data);
        if (onCreated) onCreated(res.data);
      } else {
        setError(res.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error(err);
      setError('Network or server error while submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: createdReport ? '560px' : '620px' }} onClick={(e) => e.stopPropagation()}>
        {/* If report created successfully -> Show Tracking ID Screen */}
        {createdReport ? (
          <div>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Issue Lodged
                </span>
              </div>
              <button onClick={handleClose} style={{ color: 'var(--text-dim)', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 1.75rem 2rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                Report Submitted Successfully!
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Thank you for contributing to a cleaner, safer Graphic Era campus. Your environmental complaint has been queued for maintenance dispatch.
              </p>

              {/* Unique Tracking ID Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7ef 100%)',
                  border: '2px dashed var(--border-emerald)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Public Tracking ID
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                    No Login Required
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'white', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-dark)', letterSpacing: '0.05em' }}>
                    {createdReport.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(createdReport.id)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {copied ? <Check size={14} style={{ color: 'var(--primary)' }} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <p style={{ fontSize: '0.78125rem', color: 'var(--text-dim)', marginTop: '0.75rem', marginBottom: 0, lineHeight: 1.4 }}>
                  📌 <strong>Save this code!</strong> You can enter this ID anytime on the homepage "Track Your Report" tab to view real-time technician assignments and photo proof when fixed.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleClose();
                    if (onNavigateTrack) onNavigateTrack(createdReport.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Search size={16} />
                  <span>Track Live Progress Now</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClose}
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.875rem' }}
                >
                  Done & Back to Campus Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Issue Submission Form */
          <>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>Report Issue on GLITCHX<span style={{ color: '#059669' }}>GREEN</span></h2>
              </div>
              <button onClick={handleClose} style={{ color: 'var(--text-dim)', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Issue Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Water pipe leaking heavily on 2nd floor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="waste">Waste & Overflowing Dustbins</option>
                      <option value="water_leakage">Water Leakage & Dripping Taps</option>
                      <option value="electricity">Electricity Wastage (Lights/AC)</option>
                      <option value="sanitation">Sanitation & Hygiene Issue</option>
                      <option value="other">Other Campus Environmental Issue</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency / Priority</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low (Minor cosmetic issue)</option>
                      <option value="Medium">Medium (Standard attention)</option>
                      <option value="High">High (Impacting daily flow)</option>
                      <option value="Urgent">Urgent (Safety or resource loss)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Campus Location *</label>
                    {initialLocation && location === initialLocation && (
                      <span style={{ fontSize: '0.725rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                        📍 Auto-detected via QR Code
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Science Quad - Block B, 2nd Floor Men's Restroom"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={{ paddingLeft: '32px', width: '100%' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the nature of the problem, severity, and any hazards..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Guest Reporter Info (if not logged in) */}
                {!currentUser && (
                  <div style={{ background: 'var(--surface-sage)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)', textTransform: 'uppercase' }}>
                        Reporting as Guest (No Account Required)
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Optional</span>
                    </div>

                    <div className="form-grid-2">
                      <div>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Your Name (or leave blank for Anonymous)"
                          value={reporterName}
                          onChange={(e) => setReporterName(e.target.value)}
                          style={{ fontSize: '0.8125rem' }}
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Email or Phone (for status alerts)"
                          value={reporterEmail}
                          onChange={(e) => setReporterEmail(e.target.value)}
                          style={{ fontSize: '0.8125rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Attachment */}
                <div className="form-group">
                  <label className="form-label">Attach Photo (Optional but Recommended)</label>
                  <label style={{
                    border: '2px dashed var(--border-emerald)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    background: 'var(--surface-sage)',
                    transition: 'border-color 0.2s ease'
                  }}>
                    <Upload size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--forest-dark)' }}>
                      Click to select photo or drag and drop
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      PNG, JPG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {imagePreview && (
                    <div style={{ marginTop: '0.75rem', position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-emerald)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Environmental Report'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
