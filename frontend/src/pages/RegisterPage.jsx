import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  Phone,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Wrench,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const RegisterPage = ({
  onNavigateLogin,
  onNavigateHome,
  onRegisterSuccess
}) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in your name, campus email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      department: department.trim() || 'Campus Community',
      phone: phone.trim()
    });

    setLoading(false);

    if (res.success) {
      if (onRegisterSuccess) onRegisterSuccess(res.user);
    } else {
      setError(res.error || 'Registration failed. Please try a different email.');
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background Watermark */}
      <div className="auth-watermark-bg" aria-hidden="true">
        <img src="/assets/team_vasundhara_logo.jpg" alt="" />
      </div>

      {/* Floating Nature Leaves */}
      <div className="nature-leaf-particle anim-leaf-float" style={{ top: '8%', left: '8%', fontSize: '2rem' }}>🍃</div>
      <div className="nature-leaf-particle anim-leaf-float" style={{ bottom: '10%', right: '10%', fontSize: '1.8rem', animationDelay: '1.5s' }}>🌿</div>

      <div className="auth-card-wrapper register-card">
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

          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Join GLITCHXGREEN to report environmental issues, monitor active remediation, and build a sustainable campus.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection Tabs */}
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-selection-grid">
              <div
                className={`role-select-box ${role === 'student' ? 'selected' : ''}`}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={20} className="role-box-icon" />
                <div className="role-box-title">Student</div>
                <div className="role-box-desc">Report issues & rate fixes</div>
              </div>

              <div
                className={`role-select-box ${role === 'staff' ? 'selected' : ''}`}
                onClick={() => setRole('staff')}
              >
                <Wrench size={20} className="role-box-icon" />
                <div className="role-box-title">Staff</div>
                <div className="role-box-desc">Resolve & update tickets</div>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="auth-input-wrap">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                className="form-input auth-input"
                placeholder="e.g., Samuel Green"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Campus Email</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="form-input auth-input"
                placeholder="e.g., yourname@graphicera.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Department & Phone in Two Columns */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Department / Faculty</label>
              <div className="auth-input-wrap">
                <Building size={18} className="auth-input-icon" />
                <input
                  type="text"
                  className="form-input auth-input"
                  placeholder="e.g., Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div className="auth-input-wrap">
                <Phone size={18} className="auth-input-icon" />
                <input
                  type="tel"
                  className="form-input auth-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Creating your account in Supabase...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="auth-card-footer">
          <span>Already registered on GLITCHXGREEN?</span>
          <button
            type="button"
            className="auth-text-link"
            onClick={onNavigateLogin}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
