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
  CheckCircle2
} from 'lucide-react';

export const LoginPage = ({
  onNavigateRegister,
  onNavigateHome,
  onLoginSuccess
}) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            <label className="form-label">Password</label>
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
    </div>
  );
};
