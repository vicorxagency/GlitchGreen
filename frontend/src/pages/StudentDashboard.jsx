import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReportCard } from '../components/ReportCard';
import { MetricsGrid } from '../components/MetricsGrid';
import { PlusCircle, AlertCircle, Sparkles, Filter, Leaf, CheckCircle2 } from 'lucide-react';

export const StudentDashboard = ({
  reports,
  metrics,
  onOpenCreate,
  onViewDetails,
  onOpenFeedback,
  searchTerm
}) => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter student's own reports
  const myReports = reports.filter(r => r.reported_by === currentUser?.id);

  // Issues resolved that need student's feedback
  const pendingFeedbackReports = myReports.filter(r => r.status === 'Resolved' && !r.feedback);

  // Apply category and search filter
  const filtered = myReports.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Student Hero Banner with Team Vasundhara Watermark & Nature Animations */}
      <div className="dashboard-hero-banner" style={{
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #059669 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem 2.5rem',
        color: 'white',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 28px -6px rgba(6, 78, 59, 0.35)'
      }}>
        {/* Team Vasundhara Decorative Background Watermark */}
        <div className="vasundhara-watermark-container" aria-hidden="true">
          <img
            src="/assets/team_vasundhara_logo.jpg"
            alt=""
            className="vasundhara-watermark-img"
          />
        </div>

        {/* Floating Nature Leaf Accents */}
        <div className="nature-leaf-particle anim-leaf-float" style={{ top: '15px', right: '35%', fontSize: '2rem' }}>🍃</div>
        <div className="nature-leaf-particle anim-leaf-float" style={{ bottom: '20px', left: '42%', fontSize: '1.5rem', animationDelay: '1.5s' }}>🌿</div>
        <div className="nature-leaf-particle anim-sway" style={{ top: '60px', right: '12%', fontSize: '1.8rem', animationDelay: '2.5s' }}>🌱</div>

        {/* Hero Left Content Column */}
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          {/* Supporting Team Vasundhara Label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.22)' }}>
            <Leaf size={14} className="anim-pulse-glow" style={{ color: '#6ee7b7' }} />
            Built by Team Vasundhara • Graphic Era Campus
          </div>

          {/* Primary Brand Heading */}
          <h1 style={{ fontSize: '2.25rem', color: '#ffffff', marginBottom: '0.35rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            GLITCHX<span style={{ color: '#34d399' }}>GREEN</span>
          </h1>

          {/* Project Tagline */}
          <div style={{ fontSize: '1.15rem', color: '#a7f3d0', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            "Small Actions. Greener Campuses."
          </div>

          {/* Descriptive Mission */}
          <p style={{ fontSize: '0.9375rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.35rem' }}>
            Report campus environmental issues, track resolutions, and work together toward a cleaner, more sustainable Graphic Era campus.
          </p>

          <button
            className="btn btn-primary anim-leaf-float"
            onClick={onOpenCreate}
            style={{ background: '#ffffff', color: '#064e3b', fontWeight: 800, padding: '0.75rem 1.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          >
            <PlusCircle size={18} style={{ color: '#059669' }} />
            Report Issue on GLITCHXGREEN
          </button>
        </div>

        {/* Hero Right Column: Team Vasundhara Badge & Impact Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 2, flexWrap: 'wrap' }}>
          {/* Team Vasundhara Compact Logo Badge */}
          <div className="vasundhara-hero-badge anim-leaf-float" title="Team Vasundhara — Campus Environmental Identity">
            <img
              src="/assets/team_vasundhara_logo.jpg"
              alt="Team Vasundhara logo"
              className="vasundhara-logo-img"
            />
            <div className="vasundhara-caption">
              <span>Built by Team Vasundhara</span>
            </div>
          </div>

          {/* Impact Metric Tile */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            padding: '1.25rem 1.6rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.22)',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Campus Impact</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{myReports.length} Reports</div>
            <div style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
              {myReports.filter(r => r.status === 'Resolved').length} resolved on campus
            </div>
          </div>
        </div>
      </div>

      {/* Pending Feedback Alert Banner */}
      {pendingFeedbackReports.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse-border 3s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={22} style={{ color: '#d97706' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e' }}>
                {pendingFeedbackReports.length} of your reported issues has been marked Resolved!
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
                Please share whether the issue was fixed properly and how long it took.
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ background: '#d97706', borderColor: '#d97706' }}
            onClick={() => onOpenFeedback(pendingFeedbackReports[0])}
          >
            Rate Fix for {pendingFeedbackReports[0].id}
          </button>
        </div>
      )}

      {/* Campus Health Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Section Header & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>My Environmental Reports</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Track the live progress of issues you've flagged on campus
          </p>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Issues' },
            { id: 'waste', label: 'Waste' },
            { id: 'water_leakage', label: 'Water' },
            { id: 'electricity', label: 'Electricity' },
            { id: 'sanitation', label: 'Sanitation' },
            { id: 'other', label: 'Other' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-emerald)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <Leaf size={36} style={{ color: 'var(--primary)', margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--forest-dark)', marginBottom: '0.5rem' }}>No Reports in this view</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Notice an environmental problem on campus? Submit a report now to alert maintenance.
          </p>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <PlusCircle size={16} />
            Submit Your First Report
          </button>
        </div>
      ) : (
        <div className="reports-grid">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onViewDetails={onViewDetails}
              onOpenFeedback={onOpenFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};
