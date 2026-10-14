import React from 'react';
import {
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Droplets,
  Zap,
  Trash2,
  Sparkles,
  Shield,
  BarChart3,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  MapPin,
  Check
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const LandingPage = ({
  metrics,
  reports = [],
  onOpenCreate,
  onViewDetails,
  onNavigateTrack
}) => {
  const counts = metrics?.counts || {
    total: reports.length || 5,
    reported: reports.filter(r => r.status === 'Reported').length || 1,
    assigned: reports.filter(r => r.status === 'Assigned').length || 1,
    in_progress: reports.filter(r => r.status === 'In Progress').length || 1,
    resolved: reports.filter(r => r.status === 'Resolved').length || 2
  };

  const categories = [
    {
      id: 'waste',
      title: 'Waste Management',
      desc: 'Overflowing dustbins, unsegregated litter, and recyclable collection delays across student quads.',
      icon: <Trash2 size={24} style={{ color: 'var(--emerald)' }} />,
      accent: '#29965A',
      tag: 'Campus Cleanliness'
    },
    {
      id: 'water_leakage',
      title: 'Water Leakage',
      desc: 'Dripping washroom taps, pipeline fractures, sprinkler overflows, and preventable water wastage.',
      icon: <Droplets size={24} style={{ color: '#0284c7' }} />,
      accent: '#0284c7',
      tag: 'Resource Conservation'
    },
    {
      id: 'electricity',
      title: 'Electricity Wastage',
      desc: 'High-power stadium lights or classroom ACs left running in empty campus halls during daytime.',
      icon: <Zap size={24} style={{ color: '#d97706' }} />,
      accent: '#d97706',
      tag: 'Energy Efficiency'
    },
    {
      id: 'sanitation',
      title: 'Sanitation and Cleanliness',
      desc: 'Restroom hygiene maintenance, stagnant water pools, and sanitation concerns affecting health.',
      icon: <Sparkles size={24} style={{ color: '#6366f1' }} />,
      accent: '#6366f1',
      tag: 'Hygiene & Health'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Report an Issue',
      desc: 'Students or staff submit details, campus location, urgency, and an optional photo.',
      statusKey: 'Reported',
      dotColor: '#d97706'
    },
    {
      step: '02',
      title: 'Assign Responsibility',
      desc: 'The administrator reviews the report and dispatches it to the responsible maintenance team.',
      statusKey: 'Assigned',
      dotColor: '#0284c7'
    },
    {
      step: '03',
      title: 'Track Progress',
      desc: 'The responsible team marks the ticket in progress and updates action steps until resolved.',
      statusKey: 'In Progress',
      dotColor: '#6366f1'
    },
    {
      step: '04',
      title: 'Resolve the Issue',
      desc: 'The issue is marked resolved, outcome recorded, and student feedback verified.',
      statusKey: 'Resolved',
      dotColor: '#29965A'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* ====================================================================
          1. HERO SECTION (The Main Visual Highlight)
          ==================================================================== */}
      <section className="landing-hero-section" id="home">
        {/* Team Vasundhara Decorative Background Watermark (4-6% opacity) */}
        <div className="vasundhara-hero-watermark-bg" aria-hidden="true">
          <img
            src="/assets/team_vasundhara_logo.jpg"
            alt=""
            className="vasundhara-watermark-img"
          />
        </div>

        {/* Floating Nature Leaf Accents */}
        <div className="nature-leaf-particle anim-leaf-float" style={{ top: '25px', left: '12%', fontSize: '1.75rem' }}>🍃</div>
        <div className="nature-leaf-particle anim-leaf-float" style={{ bottom: '40px', left: '46%', fontSize: '1.4rem', animationDelay: '1.8s' }}>🌿</div>
        <div className="nature-leaf-particle anim-sway" style={{ top: '80px', right: '48%', fontSize: '1.6rem', animationDelay: '2.4s' }}>🌱</div>

        <div className="landing-hero-container">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="landing-hero-left">
            <div className="landing-eyebrow-badge">
              <span className="eyebrow-pulse-dot" />
              🌱 BUILDING A GREENER TOMORROW
            </div>

            <h1 className="landing-hero-headline">
              Small Actions.<br />
              <span className="landing-headline-gradient">Greener</span> Campuses.
            </h1>

            <p className="landing-hero-subtext">
              Every campus deserves a cleaner tomorrow. Report environmental issues, track progress, and join the movement toward a more sustainable Graphic Era campus.
            </p>

            <div className="landing-hero-cta-group">
              <button
                className="btn btn-primary landing-primary-btn"
                onClick={() => onOpenCreate()}
              >
                <span>Report an Issue</span>
                <ArrowRight size={18} className="cta-arrow-hover" />
              </button>

              <button
                className="btn btn-secondary landing-secondary-btn"
                onClick={() => onNavigateTrack && onNavigateTrack()}
              >
                <Search size={16} />
                <span>Track Your Report</span>
              </button>
            </div>

            <p className="landing-hero-footnote">
              <Check size={14} style={{ color: 'var(--emerald)' }} />
              Every report is a step toward positive change.
            </p>

            <div className="hero-built-by-tag">
              <img
                src="/assets/team_vasundhara_logo.jpg"
                alt="Team Vasundhara"
                className="hero-tag-logo"
              />
              <span>Built by <strong>Team Vasundhara</strong> • Graphic Era Campus</span>
            </div>
          </div>

          {/* Right Column: Signature Earth & Living Green Campus Centerpiece */}
          <div className="landing-hero-right">
            <div className="earth-showcase-container">
              {/* Warm Golden Sunlight Glow */}
              <div className="earth-sunlight-glow" aria-hidden="true" />

              {/* Orbital Ring with Subtle Particles */}
              <div className="earth-orbital-ring" aria-hidden="true">
                <span className="orbital-particle p1">🌱</span>
                <span className="orbital-particle p2">💧</span>
                <span className="orbital-particle p3">☀️</span>
              </div>

              {/* Floating Earth & Campus Centerpiece */}
              <div className="earth-centerpiece-wrapper anim-earth-float">
                <img
                  src="/assets/earth_campus_hero.jpg"
                  alt="Planet Earth integrated with a lush green sustainable Graphic Era university campus"
                  className="earth-centerpiece-img"
                />
              </div>

              {/* Floating Badge 1: Team Vasundhara Environmental Identity (Top Left) */}
              <div className="hero-floating-glass-badge top-left anim-leaf-float">
                <img
                  src="/assets/team_vasundhara_logo.jpg"
                  alt="Team Vasundhara logo"
                  className="floating-badge-logo"
                />
                <div>
                  <div className="floating-badge-title">Built by Team Vasundhara</div>
                  <div className="floating-badge-subtitle">Campus Environmental Identity</div>
                </div>
              </div>

              {/* Floating Badge 2: Live Active Resolution Preview (Bottom Right) */}
              <div className="hero-floating-glass-badge bottom-card anim-sway">
                <div className="glass-card-header">
                  <span className="glass-card-label">ACTIVE RESOLUTION</span>
                  <StatusBadge status="In Progress" />
                </div>

                <div className="glass-card-title">
                  ECO-2024-002: Central Quad Recycling Overflow
                </div>

                <div className="glass-card-meta">
                  <MapPin size={13} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                  <span>Central Student Quad • Facilities Greenery Team</span>
                </div>

                {/* Micro Pipeline Indicator */}
                <div className="hero-mini-pipeline">
                  <span className="pipeline-dot completed" title="Reported">✓</span>
                  <span className="pipeline-connector active" />
                  <span className="pipeline-dot completed" title="Assigned">✓</span>
                  <span className="pipeline-connector active" />
                  <span className="pipeline-dot current" title="In Progress">3</span>
                  <span className="pipeline-connector" />
                  <span className="pipeline-dot" title="Resolved">4</span>
                </div>
              </div>

              {/* Depth Leaf Accents */}
              <div className="hero-depth-leaf leaf-1 anim-leaf-float">🍃</div>
              <div className="hero-depth-leaf leaf-2 anim-leaf-float" style={{ animationDelay: '1.5s' }}>🌿</div>
              <div className="hero-depth-leaf leaf-3 anim-sway" style={{ animationDelay: '2.5s' }}>🌱</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. ISSUE CATEGORIES ("A Better Tomorrow Starts with Clean Spaces")
          ==================================================================== */}
      <section className="landing-section-wrapper" id="categories">
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">CAMPUS ECO INCIDENTS</span>
            <h2 className="section-main-heading">A Better Tomorrow Starts with Clean Spaces</h2>
            <p className="section-sub-heading">
              What Needs Attention on Campus? Spot a problem? Report it. Help the right team take action.
            </p>
          </div>

          <div className="categories-grid-container">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="category-feature-card"
                onClick={() => onOpenCreate(cat.id)}
              >
                <div className="cat-card-top">
                  <div className="cat-icon-wrapper" style={{ background: `${cat.accent}15`, border: `1px solid ${cat.accent}30` }}>
                    {cat.icon}
                  </div>
                  <span className="cat-tag-badge">{cat.tag}</span>
                </div>

                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.desc}</p>

                <div className="cat-card-footer">
                  <button
                    className="btn btn-outline btn-sm cat-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreate(cat.id);
                    }}
                  >
                    <span>Report Issue</span>
                    <ArrowRight size={14} className="cat-arrow" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. HOW IT WORKS (Structured 4-Step Human-Assisted Workflow)
          ==================================================================== */}
      <section className="landing-section-wrapper workflow-section-bg" id="how-it-works">
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">CLEAR & TRANSPARENT PROCESS</span>
            <h2 className="section-main-heading">How It Works</h2>
            <p className="section-sub-heading">
              From spotting a problem to verified resolution — a systematic four-step collaboration between students and campus teams.
            </p>
          </div>

          {/* Status Progression Summary Bar */}
          <div className="workflow-status-bar">
            <div className="status-flow-chip">
              <span className="status-flow-dot reported" />
              <span>Reported</span>
            </div>
            <ArrowRight size={16} className="status-flow-arrow" />
            <div className="status-flow-chip">
              <span className="status-flow-dot assigned" />
              <span>Assigned</span>
            </div>
            <ArrowRight size={16} className="status-flow-arrow" />
            <div className="status-flow-chip">
              <span className="status-flow-dot in-progress" />
              <span>In Progress</span>
            </div>
            <ArrowRight size={16} className="status-flow-arrow" />
            <div className="status-flow-chip">
              <span className="status-flow-dot resolved" />
              <span>Resolved</span>
            </div>
          </div>

          {/* 4-Step Timeline Grid with Connecting Line */}
          <div className="workflow-steps-grid">
            {workflowSteps.map((ws, idx) => (
              <div key={ws.step} className="workflow-step-card">
                <div className="step-number-badge">
                  <span>{ws.step}</span>
                </div>
                <h3 className="step-card-title">{ws.title}</h3>
                <p className="step-card-desc">{ws.desc}</p>
                <div className="step-card-pill">
                  <span className="step-pill-indicator" style={{ background: ws.dotColor }} />
                  <span>Status: <strong>{ws.statusKey}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. CAMPUS IMPACT & DASHBOARD PREVIEW
          ==================================================================== */}
      <section className="landing-section-wrapper" id="campus-impact">
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">LIVE OPERATIONAL METRICS</span>
            <h2 className="section-main-heading">Campus Impact and Dashboard Preview</h2>
            <p className="section-sub-heading">
              A real-time look into campus issues logged, assigned, and successfully resolved.
            </p>
          </div>

          {/* 4 Key KPI Metrics Cards */}
          <div className="dashboard-kpi-grid">
            <div className="kpi-preview-card">
              <div className="kpi-icon-wrap" style={{ background: 'var(--soft-sage)', color: 'var(--forest-green)' }}>
                <Layers size={22} />
              </div>
              <div className="kpi-number">{counts.total}</div>
              <div className="kpi-label">Total Reports</div>
              <div className="kpi-subtext">Issues registered campus-wide</div>
            </div>

            <div className="kpi-preview-card">
              <div className="kpi-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <AlertCircle size={22} />
              </div>
              <div className="kpi-number">{counts.reported + counts.assigned}</div>
              <div className="kpi-label">Pending / Triage</div>
              <div className="kpi-subtext">Awaiting or assigned to staff</div>
            </div>

            <div className="kpi-preview-card">
              <div className="kpi-icon-wrap" style={{ background: '#eef2ff', color: '#6366f1' }}>
                <Clock size={22} />
              </div>
              <div className="kpi-number">{counts.in_progress}</div>
              <div className="kpi-label">Issues In Progress</div>
              <div className="kpi-subtext">Active repair & maintenance</div>
            </div>

            <div className="kpi-preview-card">
              <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: 'var(--emerald)' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-number">{counts.resolved}</div>
              <div className="kpi-label">Resolved Issues</div>
              <div className="kpi-subtext">Remediated & verified</div>
            </div>
          </div>

          {/* Resolution Progress Bar Preview */}
          <div className="dashboard-distribution-preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                  Issue Resolution Status Pipeline
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sample breakdown of currently tracked campus records
                </p>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onNavigateTrack && onNavigateTrack()}
              >
                <span>View Full Issue Catalog</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="resolution-stacked-bar">
              <div
                style={{
                  width: `${Math.max(15, Math.round((counts.resolved / (counts.total || 1)) * 100))}%`,
                  background: 'var(--emerald)'
                }}
                title={`Resolved: ${counts.resolved}`}
              />
              <div
                style={{
                  width: `${Math.max(15, Math.round((counts.in_progress / (counts.total || 1)) * 100))}%`,
                  background: '#6366f1'
                }}
                title={`In Progress: ${counts.in_progress}`}
              />
              <div
                style={{
                  width: `${Math.max(15, Math.round(((counts.reported + counts.assigned) / (counts.total || 1)) * 100))}%`,
                  background: '#d97706'
                }}
                title={`Pending: ${counts.reported + counts.assigned}`}
              />
            </div>

            <div className="resolution-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--emerald)' }} /> Resolved ({counts.resolved})</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#6366f1' }} /> In Progress ({counts.in_progress})</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#d97706' }} /> Pending / Assigned ({counts.reported + counts.assigned})</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. WHY GLITCHXGREEN? (Three Core Benefits)
          ==================================================================== */}
      <section className="landing-section-wrapper" style={{ background: 'var(--canvas-secondary)' }}>
        <div className="landing-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">DESIGNED FOR CAMPUS EXCELLENCE</span>
            <h2 className="section-main-heading">Why GLITCHXGREEN?</h2>
            <p className="section-sub-heading">
              A modern digital platform bringing accountability, speed, and visibility to campus environmental sustainability.
            </p>
          </div>

          <div className="why-glitchx-grid">
            <div className="why-card">
              <div className="why-card-icon" style={{ background: 'var(--soft-sage)', color: 'var(--forest-green)' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 className="why-card-title">Transparent Tracking</h3>
              <p className="why-card-desc">
                Users can follow the status of reported campus issues in real time, from initial submission and assignment to verified repair.
              </p>
            </div>

            <div className="why-card">
              <div className="why-card-icon" style={{ background: 'var(--soft-sage)', color: 'var(--forest-green)' }}>
                <Shield size={24} />
              </div>
              <h3 className="why-card-title">Clear Responsibility</h3>
              <p className="why-card-desc">
                Administrators can review incoming reports and dispatch them directly to the appropriate campus maintenance and sanitation teams.
              </p>
            </div>

            <div className="why-card">
              <div className="why-card-icon" style={{ background: 'var(--soft-sage)', color: 'var(--forest-green)' }}>
                <BarChart3 size={24} />
              </div>
              <h3 className="why-card-title">Data-Driven Improvement</h3>
              <p className="why-card-desc">
                Basic analytics help identify recurring problem areas across buildings, track team performance, and monitor overall resolution rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. TEAM VASUNDHARA IDENTITY SECTION
          ==================================================================== */}
      <section className="landing-section-wrapper" id="team-vasundhara">
        <div className="landing-container">
          <div className="team-vasundhara-showcase-card">
            {/* Subtle Botanical Watermark Accent */}
            <div className="team-watermark-bg" aria-hidden="true">
              <img
                src="/assets/team_vasundhara_logo.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div className="team-showcase-content">
              <div className="team-logo-display anim-leaf-float">
                <img
                  src="/assets/team_vasundhara_logo.jpg"
                  alt="Team Vasundhara logo"
                  className="vasundhara-display-logo-img"
                />
              </div>

              <div className="team-text-block">
                <span className="team-sub-badge">CAMPUS ENVIRONMENTAL IDENTITY</span>
                <h2 className="team-main-heading">Technology for a Greener Tomorrow.</h2>
                <p className="team-main-text">
                  GLITCHXGREEN is our effort to make campus environmental issues easier to report, track, and resolve. Developed for the Graphic Era campus as part of our ongoing commitment to environmental stewardship.
                </p>
                <div className="team-attribution-row">
                  <span>Built by <strong>Team Vasundhara</strong></span>
                  <span>•</span>
                  <span>Graphic Era Campus Climate Hackathon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. FINAL CALL TO ACTION (CTA)
          ==================================================================== */}
      <section className="landing-final-cta-section">
        <div className="landing-container">
          <div className="final-cta-card">
            {/* Nature Leaf Accent */}
            <div className="nature-leaf-particle anim-leaf-float" style={{ top: '15px', right: '15%', fontSize: '2rem' }}>🍃</div>

            <span className="final-cta-eyebrow">TAKE ACTION TODAY</span>
            <h2 className="final-cta-heading">Let's Make Our Campus Greener.</h2>
            <p className="final-cta-subtext">
              See an environmental issue? Take the first step toward getting it resolved.
            </p>

            <button
              className="btn btn-primary final-cta-btn anim-leaf-float"
              onClick={() => onOpenCreate()}
            >
              <PlusCircle size={18} />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
