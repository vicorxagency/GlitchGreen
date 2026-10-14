import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from './RoleBadge';
import {
  PlusCircle,
  Menu,
  X,
  Compass,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  TreePine,
  User,
  Shield
} from 'lucide-react';

export const Navbar = ({
  onOpenCreateModal,
  activeTab,
  setActiveTab
}) => {
  const { currentUser, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    handleNavClick('landing');
  };

  const handleNavClick = (tabOrAnchor) => {
    setMobileMenuOpen(false);
    if (tabOrAnchor.startsWith('#')) {
      if (activeTab !== 'landing') {
        setActiveTab('landing');
        setTimeout(() => {
          const el = document.querySelector(tabOrAnchor);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(tabOrAnchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveTab(tabOrAnchor);
    }
  };

  return (
    <header className="top-navbar">
      {/* 1. Official College Branding & GLITCHXGREEN Wordmark */}
      <div className="brand-section">
        {/* Graphic Era Official College Logo */}
        <button
          onClick={() => handleNavClick('landing')}
          className="graphic-era-logo-link"
          title="Graphic Era (Deemed to be University)"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <img
            src="/assets/graphic_era_logo.jpg"
            alt="Graphic Era logo"
            className="graphic-era-navbar-logo"
          />
        </button>

        {/* Hairline Divider */}
        <div className="navbar-brand-divider" aria-hidden="true" />

        {/* GLITCHXGREEN Brand Wordmark */}
        <button
          onClick={() => handleNavClick('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div className="glitchx-logo-badge anim-sway" title="GLITCHXGREEN — Innovation x Sustainability">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 15.5 3.8 18.58 6.54 20.35C6.73 17.5 8.1 14.88 10.3 13.08C12.5 11.28 15.4 10.4 18.3 10.6C18.1 8.2 16.9 5.98 14.9 4.38C14.05 3.7 13.06 3.1 12 2Z"
                fill="url(#leafGradientNavbar)"
              />
              <path
                d="M19.5 12C20.4 13.3 21 14.8 21 16.5C21 19.54 18.54 22 15.5 22C13.8 22 12.3 21.4 11.2 20.4C14.2 19.8 16.7 17.9 18.2 15.3L19.5 12Z"
                fill="#29965A"
                opacity="0.9"
              />
              <circle cx="12" cy="12" r="2" fill="#ffffff" />
              <defs>
                <linearGradient id="leafGradientNavbar" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#29965A" />
                  <stop offset="0.6" stopColor="#174C35" />
                  <stop offset="1" stopColor="#103B2B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
            <div className="glitchx-brand-name">
              <span className="glitchx-part-tech">GLITCHX</span>
              <span className="glitchx-part-green">GREEN</span>
            </div>
            <div className="glitchx-tagline" style={{ whiteSpace: 'nowrap' }}>
              <span className="glitchx-tagline-dot"></span>
              Campus Eco-Tracker
            </div>
          </div>
        </button>
      </div>

      {/* 2. Desktop Navigation Links */}
      <nav className="navbar-desktop-nav">
        <button
          className={`nav-text-link ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => handleNavClick('landing')}
        >
          Home
        </button>

        <button
          className={`nav-text-link ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => handleNavClick('track')}
        >
          Track Issue
        </button>

        <button
          className="nav-text-link"
          onClick={() => handleNavClick('#how-it-works')}
        >
          How It Works
        </button>

        <button
          className="nav-text-link"
          onClick={() => handleNavClick('#campus-impact')}
        >
          Campus Impact
        </button>
      </nav>

      {/* 3. Action Group & User Profile */}
      <div className="navbar-action-group">
        {/* Prominent Primary CTA (Desktop) */}
        <button
          className="btn btn-primary glitchx-cta-btn navbar-desktop-cta anim-leaf-float"
          onClick={onOpenCreateModal}
        >
          <PlusCircle size={16} />
          <span>Report an Issue</span>
        </button>

        {/* Compact Quick Report CTA (Mobile) - only show when logged in to preserve room for auth controls */}
        {currentUser && (
          <button
            className="btn btn-primary navbar-mobile-cta"
            onClick={onOpenCreateModal}
            title="Report an Issue"
          >
            <PlusCircle size={15} />
            <span>Report</span>
          </button>
        )}

        {/* Portal View Quick Toggle (Desktop only, if logged in) */}
        {currentUser && (
          <button
            className="btn btn-outline navbar-desktop-cta navbar-workspace-btn"
            onClick={() => handleNavClick(role === 'student' ? 'student-my-reports' : role === 'staff' ? 'staff-assigned' : 'admin-dashboard')}
            title="Switch to Role Workspace Dashboard"
          >
            <Compass size={15} style={{ color: 'var(--emerald)' }} />
            <span>Role Workspace</span>
          </button>
        )}

        {/* Auth Navigation: Profile Dropdown or Sign In / Register */}
        {currentUser ? (
          <div className="navbar-auth-section" ref={profileRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {/* Profile Pill Trigger Button */}
              <button
                className={`navbar-profile-btn ${profileDropdownOpen ? 'active' : ''}`}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                title="View Profile & Account Menu"
                aria-label="User Account Menu"
                aria-expanded={profileDropdownOpen}
              >
                <img
                  src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.full_name}
                  className="navbar-avatar-img"
                />
                <div className="navbar-profile-info desktop-only-text">
                  <span className="navbar-profile-name">
                    {currentUser?.full_name?.split(' ')[0]}
                  </span>
                  <span className="navbar-profile-role-tag">{role}</span>
                </div>
                <ChevronDown
                  size={14}
                  className="navbar-profile-chevron"
                  style={{
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: 'var(--text-muted)'
                  }}
                />
              </button>

              {/* Direct Desktop Sign Out Button */}
              <button
                className="btn btn-outline btn-sm navbar-direct-logout desktop-only-text"
                onClick={handleLogout}
                title="Sign Out of GLITCHXGREEN"
              >
                <LogOut size={13} style={{ color: '#dc2626' }} />
                <span>Log Out</span>
              </button>
            </div>

            {/* Profile & Account Dropdown Popover */}
            {profileDropdownOpen && (
              <div className="navbar-profile-dropdown">
                {/* User Card Header */}
                <div className="profile-dropdown-header">
                  <img
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser?.full_name}
                    className="profile-dropdown-avatar"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="profile-dropdown-name">{currentUser?.full_name}</div>
                    <div className="profile-dropdown-email">{currentUser?.email}</div>
                    <div style={{ marginTop: '0.35rem' }}>
                      <RoleBadge role={role} />
                    </div>
                  </div>
                </div>

                {currentUser?.department && (
                  <div className="profile-dropdown-dept">
                    📍 {currentUser.department}
                  </div>
                )}

                <div className="profile-dropdown-divider" />

                {/* Navigation Links */}
                <div className="profile-dropdown-links">
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick(role === 'student' ? 'student-my-reports' : role === 'staff' ? 'staff-assigned' : 'admin-dashboard');
                    }}
                  >
                    <Compass size={16} style={{ color: 'var(--emerald)' }} />
                    <span>Go to {role === 'student' ? 'Student Workspace' : role === 'staff' ? 'Staff Operations' : 'Admin Suite'}</span>
                  </button>

                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavClick('all-reports');
                    }}
                  >
                    <TreePine size={16} style={{ color: 'var(--emerald)' }} />
                    <span>Track Campus Issues</span>
                  </button>

                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenCreateModal();
                    }}
                  >
                    <PlusCircle size={16} style={{ color: 'var(--emerald)' }} />
                    <span>Report New Issue</span>
                  </button>
                </div>

                <div className="profile-dropdown-divider" />

                {/* Logout Button */}
                <button
                  className="profile-dropdown-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Log Out of Account</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-auth-buttons">
            <button
              className="btn btn-outline navbar-login-btn"
              onClick={() => handleNavClick('login')}
              title="Sign in with your campus account"
            >
              <LogIn size={15} style={{ color: 'var(--emerald)' }} />
              <span>Log In</span>
            </button>
            <button
              className="btn btn-primary navbar-register-btn"
              onClick={() => handleNavClick('register')}
              title="Create a new student or staff account"
            >
              <UserPlus size={15} />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 4. Mobile Responsive Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-emerald)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50
        }}>
          {/* User Account Card at Top of Drawer */}
          {currentUser ? (
            <div className="mobile-drawer-user-card" style={{
              background: 'var(--surface-sage)',
              border: '1px solid var(--border-emerald)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img
                  src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.full_name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--emerald)', background: '#fff' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)', fontSize: '0.95rem' }}>
                    {currentUser?.full_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.email}
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <RoleBadge role={role} />
                  </div>
                </div>
              </div>

              <button
                className="btn btn-danger"
                onClick={handleLogout}
                style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', height: '36px', fontSize: '0.8125rem' }}
              >
                <LogOut size={15} />
                <span>Log Out ({currentUser?.full_name?.split(' ')[0]})</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => handleNavClick('login')}
                style={{ flex: 1, justifyContent: 'center', height: '38px' }}
              >
                <LogIn size={15} style={{ color: 'var(--emerald)' }} />
                <span>Log In</span>
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleNavClick('register')}
                style={{ flex: 1, justifyContent: 'center', height: '38px' }}
              >
                <UserPlus size={15} />
                <span>Register</span>
              </button>
            </div>
          )}

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.15rem 0' }} />

          <button className="mobile-nav-link" onClick={() => handleNavClick('landing')}>
            Home
          </button>
          <button className="mobile-nav-link" onClick={() => { setMobileMenuOpen(false); onOpenCreateModal(); }}>
            Report an Issue
          </button>
          <button className="mobile-nav-link" onClick={() => handleNavClick('track')}>
            Track Issue
          </button>
          <button className="mobile-nav-link" onClick={() => handleNavClick('#how-it-works')}>
            How It Works
          </button>
          <button className="mobile-nav-link" onClick={() => handleNavClick('#campus-impact')}>
            Campus Impact
          </button>
          {currentUser && (
            <button className="mobile-nav-link" onClick={() => handleNavClick(role === 'student' ? 'student-my-reports' : role === 'staff' ? 'staff-assigned' : 'admin-dashboard')}>
              <Compass size={15} style={{ marginRight: '0.4rem', color: 'var(--emerald)' }} />
              Role Workspace ({role})
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => { setMobileMenuOpen(false); onOpenCreateModal(); }}
            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
          >
            <PlusCircle size={16} />
            Report an Issue
          </button>
        </div>
      )}
    </header>
  );
};

