import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const LoginPage = ({
  onNavigateRegister,
  onNavigateHome,
  onLoginSuccess
}) => {
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset Password State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your campus email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid email or password. Please verify your credentials.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetMsg({ text: '', type: '' });

    if (!resetEmail.trim()) {
      setResetMsg({ text: 'Please enter your campus email address.', type: 'error' });
      return;
    }

    if (!resetNewPass || resetNewPass.length < 6) {
      setResetMsg({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setResetMsg({ text: 'Passwords do not match. Please ensure both fields match.', type: 'error' });
      return;
    }

    setResetLoading(true);

    try {
      const res = await resetPassword(resetEmail.trim(), resetNewPass);
      if (res.success) {
        setResetMsg({
          text: res.message || 'Password reset successfully! You can now sign in with your new password.',
          type: 'success'
        });
        setEmail(resetEmail.trim());
        setPassword('');
        setTimeout(() => {
          setShowResetModal(false);
          setResetNewPass('');
          setResetConfirmPass('');
          setResetMsg({ text: '', type: '' });
        }, 2200);
      } else {
        setResetMsg({ text: res.error || 'Failed to reset password.', type: 'error' });
      }
    } catch (err) {
      setResetMsg({ text: 'Connection error while resetting password.', type: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background Watermark */}
      <div className="auth-watermark-bg" aria-hidden="true">
        <img src="/assets/team_vasundhara_logo.jpg" alt="" />
      </div>

      {/* Floating Nature Leaves */}
      <div className="nature-leaf-particle anim-leaf-float" style={{ top: '8%', left: '10%', fontSize: '2rem' }}>🍃</div>
      <div className="nature-leaf-particle anim-leaf-float" style={{ bottom: '12%', right: '12%', fontSize: '1.8rem', animationDelay: '1.5s' }}>🌿</div>

      <div className="auth-card-wrapper">
        {/* Top Back Navigation */}
        <button
          onClick={onNavigateHome}
          className="auth-back-btn"
          title="Return to Landing Page"
        >
          <ArrowLeft size={16} />
          <span>Back to Campus Home</span>
        </button>

        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logos-row">
            <img
              src="/assets/graphic_era_logo.jpg"
              alt="Graphic Era logo"
              className="auth-college-logo"
            />
            <div className="auth-logo-divider" />
            <div className="glitchx-brand-name">
              <span className="glitchx-part-tech">GLITCHX</span>
              <span className="glitchx-part-green">GREEN</span>
            </div>
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to report campus environmental issues, track resolutions, and support sustainability across Graphic Era.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Campus Email</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input"
                placeholder="e.g., student@graphicera.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email.trim());
                  setResetMsg({ text: '', type: '' });
                  setShowResetModal(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--emerald)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Reset Password?
              </button>
            </div>
            <div className="auth-input-wrap">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="auth-card-footer">
          <span>Don't have an account yet?</span>
          <button
            type="button"
            className="auth-text-link"
            onClick={onNavigateRegister}
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowResetModal(false)}
          style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', width: '92%' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} style={{ color: 'var(--emerald)' }} />
                <h2 style={{ fontSize: '1.2rem', color: 'var(--forest-dark)', margin: 0 }}>Reset Password</h2>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                style={{ color: 'var(--text-dim)', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  Enter your registered campus email and choose your new password.
                </p>

                {resetMsg.text && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: resetMsg.type === 'success' ? '#ecfdf5' : '#fee2e2',
                    color: resetMsg.type === 'success' ? '#047857' : '#b91c1c',
                    border: `1px solid ${resetMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                  }}>
                    {resetMsg.type === 'success' ? <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> : <AlertCircle size={16} style={{ flexShrink: 0 }} />}
                    <span>{resetMsg.text}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Campus Email *</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      className="form-input auth-input"
                      placeholder="e.g. kadiyanjatin28@gmail.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Password *</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      className="form-input auth-input"
                      placeholder="At least 6 characters"
                      value={resetNewPass}
                      onChange={(e) => setResetNewPass(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowNewPass(!showNewPass)}
                      tabIndex={-1}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Confirm New Password *</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      className="form-input auth-input"
                      placeholder="Confirm new password"
                      value={resetConfirmPass}
                      onChange={(e) => setResetConfirmPass(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      tabIndex={-1}
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
