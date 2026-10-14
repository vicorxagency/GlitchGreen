import React from 'react';
import { Leaf, Sparkles, Globe, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glitchx-footer" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Footer Background Watermark */}
      <div style={{
        position: 'absolute',
        right: '4%',
        bottom: '-20px',
        width: '220px',
        height: '220px',
        opacity: 0.045,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <img
          src="/assets/team_vasundhara_logo.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div className="glitchx-footer-inner" style={{ position: 'relative', zIndex: 2 }}>
        <div className="glitchx-footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#ffffff'
            }}>
              GLITCHX<span style={{ color: '#10b981' }}>GREEN</span>
            </span>

            <span style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#6ee7b7',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              GRAPHIC ERA CAMPUS CLIMATE HACKATHON
            </span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#a7f3d0', maxWidth: '580px', lineHeight: 1.5, marginTop: '0.35rem' }}>
            A software-based solution for campus environmental sustainability. Small actions, greener campuses — empowering Graphic Era students and facilities staff to report, triage, and remediate ecological issues collaboratively.
          </p>

          {/* Institutional & Team Identity Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <img
                src="/assets/graphic_era_logo.jpg"
                alt="Graphic Era logo"
                style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>Graphic Era Campus</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <img
                src="/assets/team_vasundhara_logo.jpg"
                alt="Team Vasundhara logo"
                style={{ height: '24px', width: '24px', borderRadius: '50%', objectFit: 'contain', background: 'white' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>Built by Team Vasundhara</span>
            </div>
          </div>
        </div>

        <div className="glitchx-footer-links" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6ee7b7' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={14} style={{ color: '#34d399' }} /> Graphic Era Eco-Portal
            </span>
            <span>•</span>
            <span>Version 2.4-eco</span>
          </div>
          <div style={{ color: '#a7f3d0', fontSize: '0.75rem' }}>
            © 2026 <strong>GLITCHXGREEN</strong> • Team Vasundhara • All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
