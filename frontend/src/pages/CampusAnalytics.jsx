import React from 'react';
import { MetricsGrid } from '../components/MetricsGrid';
import { BarChart3, Star, Droplets, Zap, Trash2, Sparkles, CheckCircle2, TrendingUp, Clock } from 'lucide-react';

export const CampusAnalytics = ({ metrics, reports }) => {
  const categories = metrics?.categoriesCount || {};
  const satisfaction = metrics?.satisfaction || {
    averageRating: 5.0,
    totalReviews: 1,
    resolutionAccuracyRate: 100
  };

  const categoryMeta = [
    { id: 'waste', label: 'Waste & Overflowing Dustbins', icon: <Trash2 size={16} />, color: '#059669' },
    { id: 'water_leakage', label: 'Water Leakage & Pipeline Faults', icon: <Droplets size={16} />, color: '#0284c7' },
    { id: 'electricity', label: 'Electricity & Lighting Wastage', icon: <Zap size={16} />, color: '#d97706' },
    { id: 'sanitation', label: 'Sanitation & Hygiene Concerns', icon: <Sparkles size={16} />, color: '#6366f1' },
    { id: 'other', label: 'Other Campus Environmental Issues', icon: <BarChart3 size={16} />, color: '#64748b' }
  ];

  const totalReports = reports.length || 1;

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)' }}>GLITCHX<span style={{ color: '#059669' }}>GREEN</span> Sustainability & Resolution Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Real-time metrics on report volumes, recurring problem areas, resolution rate, and student feedback
        </p>
      </div>

      <MetricsGrid metrics={metrics} />

      {/* 2-Column Analytics Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown */}
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-emerald)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            Recurring Issues by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {categoryMeta.map(cat => {
              const count = categories[cat.id]?.count || reports.filter(r => r.category === cat.id).length;
              const percentage = Math.round((count / totalReports) * 100);

              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--forest-surface)' }}>
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                      {cat.label}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--forest-dark)' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--canvas-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: cat.color, borderRadius: '9999px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Satisfaction & Quality Breakdown */}
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-emerald)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--forest-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Star size={18} style={{ color: '#eab308' }} />
            Student Resolution Satisfaction & Timeliness
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '1.25rem', background: 'var(--surface-sage)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-emerald)', paddingRight: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--forest-dark)', lineHeight: 1 }}>
                {satisfaction.averageRating}
              </div>
              <div style={{ color: '#eab308', fontSize: '1.1rem', marginTop: '0.2rem' }}>★★★★★</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {satisfaction.totalReviews} verified review{satisfaction.totalReviews === 1 ? '' : 's'}
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Resolution Accuracy</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#047857' }}>
                  {satisfaction.resolutionAccuracyRate}% Problem Solved Properly
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Time to Fix Perception</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--forest-dark)' }}>
                  Satisfactory / Faster than expected
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Savings Summary */}
          <div style={{ background: 'var(--canvas-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-dark)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Estimated Ecological Resource Savings
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0284c7' }}>~1,850 L</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Water Saved</div>
              </div>
              <div style={{ background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>420 kg</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Waste Recycled</div>
              </div>
              <div style={{ background: 'white', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#d97706' }}>~320 kWh</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Energy Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
