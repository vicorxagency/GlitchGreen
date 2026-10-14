import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Sparkles,
  ShieldCheck,
  TreePine,
  Layers,
  Smartphone
} from 'lucide-react';

const CAMPUS_LOCATIONS = [
  'Cafeteria & Dining Courtyard',
  'Computer Science & IT Block',
  'Central University Library',
  'Student Activity Centre (SAC)',
  'Mechanical & Civil Engineering Labs',
  'Bio-Tech & Chemistry Complex',
  'Girls & Boys Hostels Zone',
  'Sports Arena & Gymnasium',
  'Main Campus Gate & Bus Terminal'
];

const CATEGORIES = [
  { id: '', label: 'Any / General Issue' },
  { id: 'waste', label: 'Waste & Bin Overflow' },
  { id: 'water', label: 'Water Leakage & Taps' },
  { id: 'energy', label: 'Electrical & HVAC' },
  { id: 'landscape', label: 'Landscape & Greenery' },
  { id: 'hazard', label: 'Hazardous Material' }
];

export const GenerateQRModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [posterTitle, setPosterTitle] = useState('Report Campus Environmental Hazard');
  const printRef = useRef(null);

  // Determine active location string
  const activeLocation = selectedLocation === 'custom' ? customLocation : selectedLocation;

  // Build the direct scan URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const queryParams = new URLSearchParams();
  queryParams.set('action', 'report');
  if (activeLocation.trim()) {
    queryParams.set('location', activeLocation.trim());
  }
  if (selectedCategory) {
    queryParams.set('category', selectedCategory);
  }
  const generatedUrl = `${baseUrl}/?${queryParams.toString()}`;

  // Generate QR code data URL whenever URL changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(generatedUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#064e3b', // Deep Graphic Era emerald green
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [generatedUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    const filename = activeLocation
      ? `GlitchxGreen-QR-${activeLocation.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
      : 'GlitchxGreen-Report-QR.png';
    link.download = filename;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;

    // Clean up any previous print iframe
    const existingFrame = document.getElementById('qr-print-frame');
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'qr-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const printDoc = iframe.contentWindow.document;
    printDoc.open();
    printDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Graphic Era — Environmental Report Signage</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            html, body {
              height: 100%;
              background: #ffffff;
              color: #103B2B;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .poster-card {
              width: 100%;
              max-width: 500px;
              border: 3px solid #174C35;
              border-radius: 18px;
              padding: 26px 24px;
              text-align: center;
              background: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: none;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .brand-row {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 12px;
            }
            .brand-logo {
              height: 44px;
              width: auto;
              object-fit: contain;
            }
            .brand-text {
              text-align: left;
              line-height: 1.15;
            }
            .brand-name {
              font-size: 15px;
              font-weight: 900;
              color: #174C35;
              letter-spacing: 0.5px;
            }
            .brand-sub {
              font-size: 10.5px;
              font-weight: 700;
              color: #29965A;
              letter-spacing: 0.2px;
            }
            .badge {
              display: inline-block;
              background: #EAF5EE;
              border: 1px solid #C8DFD1;
              color: #174C35;
              font-size: 10.5px;
              font-weight: 800;
              letter-spacing: 0.75px;
              padding: 4px 12px;
              border-radius: 999px;
              margin-bottom: 12px;
              text-transform: uppercase;
            }
            .title {
              font-size: 22px;
              font-weight: 900;
              color: #103B2B;
              line-height: 1.25;
              margin-bottom: 10px;
              max-width: 440px;
            }
            .location-pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #F0FDF4;
              border: 1.5px solid #86EFAC;
              color: #047857;
              font-size: 13px;
              font-weight: 800;
              padding: 5px 14px;
              border-radius: 8px;
              margin-bottom: 14px;
            }
            .qr-frame {
              background: #ffffff;
              border: 1.5px solid #C8DFD1;
              border-radius: 14px;
              padding: 14px;
              margin-bottom: 14px;
              display: inline-block;
            }
            .qr-img {
              width: 210px;
              height: 210px;
              display: block;
            }
            .cta-main {
              font-size: 14px;
              font-weight: 800;
              color: #174C35;
              margin-bottom: 4px;
            }
            .cta-sub {
              font-size: 11px;
              color: #526357;
              font-weight: 500;
              line-height: 1.4;
              max-width: 380px;
            }
            .footer-note {
              margin-top: 16px;
              padding-top: 10px;
              border-top: 1px dashed #C8DFD1;
              width: 100%;
              font-size: 10px;
              font-weight: 600;
              color: #7F9185;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="poster-card">
            <div class="brand-row">
              <img src="/assets/graphic_era_logo.jpg" class="brand-logo" alt="Graphic Era University" />
              <div class="brand-text">
                <div class="brand-name">GRAPHIC ERA (DEEMED TO BE UNIVERSITY)</div>
                <div class="brand-sub">CAMPUS SUSTAINABILITY & ECO-ACTION TASKFORCE</div>
              </div>
            </div>

            <div class="badge">🌱 GLITCHXGREEN SPOT SIGNAGE</div>

            <h1 class="title">${posterTitle || 'Report Campus Environmental Hazard'}</h1>

            ${activeLocation ? `
              <div class="location-pill">
                <span>📍 Location: <strong>${activeLocation}</strong></span>
              </div>
            ` : ''}

            <div class="qr-frame">
              <img src="${qrDataUrl}" class="qr-img" alt="Direct Scan QR Code" />
            </div>

            <div class="cta-main">📱 Scan with Smartphone Camera to File Report</div>
            <div class="cta-sub">
              Instant Photo Upload • No Login or App Required • Direct Live Tracking ID Provided
            </div>

            <div class="footer-note">
              <span>Official Campus Eco-Tracker</span>
              <span>Powered by GLITCHXGREEN</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printDoc.close();

    // Trigger print after iframe renders
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 300);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 44, 34, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'var(--surface-primary)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(2, 44, 34, 0.4)',
          border: '1px solid var(--border-emerald)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6ee7b7'
              }}
            >
              <QrCode size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'white' }}>
                Campus Report QR Code Generator
              </h2>
              <p style={{ fontSize: '0.785rem', color: '#a7f3d0', margin: '0.15rem 0 0' }}>
                Generate instant scan-and-report QR stickers and printable posters for campus locations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {/* Left Column: Configuration Controls */}
          <div>
            {/* Step 1: Campus Location Pre-set */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)' }} />
                Pre-set Campus Location (Optional)
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                When scanned, the report form will automatically pre-fill this location.
              </p>

              <select
                className="form-input"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: '100%', marginBottom: selectedLocation === 'custom' ? '0.5rem' : 0 }}
              >
                <option value="">-- General Campus (No pre-set location) --</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
                <option value="custom">✏️ Custom Specific Location...</option>
              </select>

              {selectedLocation === 'custom' && (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block C, 3rd Floor Water Cooler Room..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  autoFocus
                />
              )}
            </div>

            {/* Step 2: Category Pre-selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.4rem' }}>
                <Layers size={15} style={{ color: 'var(--primary)' }} />
                Target Environmental Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: isSelected ? 'var(--surface-sage)' : 'var(--canvas-secondary)',
                        color: isSelected ? 'var(--forest-dark)' : 'var(--text-main)',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.785rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Poster Title Override */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--forest-dark)', display: 'block', marginBottom: '0.35rem' }}>
                Poster Headline Text
              </label>
              <input
                type="text"
                className="form-input"
                value={posterTitle}
                onChange={(e) => setPosterTitle(e.target.value)}
                placeholder="e.g. Report Environmental Hazard Here"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>

            {/* Step 4: Direct URL Display & Copy */}
            <div
              style={{
                background: 'var(--surface-sage)',
                border: '1px solid var(--border-emerald)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem',
                marginTop: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  Target Destination URL
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Live Redirect
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: 'var(--forest-dark)',
                  background: 'white',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  marginBottom: '0.5rem'
                }}
              >
                {generatedUrl}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: '0.75rem', gap: '0.3rem' }}
                >
                  {copied ? <Check size={13} style={{ color: 'var(--emerald)' }} /> : <Copy size={13} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', gap: '0.3rem', textDecoration: 'none' }}
                  title="Test link in new browser tab"
                >
                  <ExternalLink size={13} />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Live Poster / Sticker Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Printable Signage Preview
            </span>

            {/* Poster Card (Print Target) */}
            <div
              id="qr-printable-poster"
              ref={printRef}
              style={{
                width: '100%',
                maxWidth: '360px',
                background: '#ffffff',
                border: '2px solid var(--forest-green)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Graphic Era Brand Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <img
                  src="/assets/graphic_era_logo.jpg"
                  alt="Graphic Era University"
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#064e3b', letterSpacing: '0.02em' }}>
                    GRAPHIC ERA
                  </div>
                  <div style={{ fontSize: '0.625rem', color: '#526357', fontWeight: 600 }}>
                    Campus Sustainability Dept.
                  </div>
                </div>
              </div>

              {/* Tag / Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#065f46',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  marginBottom: '0.65rem',
                  border: '1px solid rgba(5, 150, 105, 0.25)'
                }}
              >
                <Sparkles size={11} />
                <span>GLITCHXGREEN SPOT SIGNAGE</span>
              </div>

              {/* Headline */}
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#064e3b',
                  lineHeight: 1.25,
                  margin: '0 0 0.45rem'
                }}
              >
                {posterTitle}
              </h3>

              {activeLocation && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#047857',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    marginBottom: '0.65rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <MapPin size={12} />
                  <span>{activeLocation}</span>
                </div>
              )}

              {/* QR Code Container */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #d1fae5',
                  boxShadow: '0 4px 12px rgba(6, 78, 59, 0.08)',
                  margin: '0.35rem 0 0.75rem'
                }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Campus Report QR Code"
                    style={{ width: '200px', height: '200px', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Instructions Callout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#064e3b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Smartphone size={14} style={{ color: '#059669' }} />
                <span>Scan with Camera to File Report</span>
              </div>
              <p style={{ fontSize: '0.6875rem', color: '#6b7280', margin: 0 }}>
                Instant photo upload • Real-time tracking ID provided
              </p>
            </div>

            {/* Poster Action Buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.25rem', width: '100%', maxWidth: '360px' }}>
              <button
                type="button"
                onClick={handleDownloadPNG}
                className="btn btn-outline"
                style={{ flex: 1, fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Download size={15} />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.8125rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Printer size={15} />
                <span>Print Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            background: 'var(--canvas-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--emerald)' }} />
            <span>Admins can place printed stickers on recycling bins, water points, and classrooms.</span>
          </div>

          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Close Generator
          </button>
        </div>
      </div>
    </div>
  );
};
