import React, { useState } from 'react';
import { ReportCard } from '../components/ReportCard';
import { Filter, Search, PlusCircle, TreePine } from 'lucide-react';

export const ReportsCatalog = ({
  reports,
  onViewDetails,
  onOpenFeedback,
  onOpenResolve,
  onOpenAssign,
  onDeleteReport,
  onOpenCreate,
  searchTerm,
  setSearchTerm
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = reports.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchesSearch = !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)' }}>GLITCHX<span style={{ color: '#059669' }}>GREEN</span> Report Catalog</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Transparent real-time tracking of all reported environmental hazards and remediation efforts across campus
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenCreate}>
          <PlusCircle size={16} />
          Report New Issue
        </button>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'var(--surface-card)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-emerald)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--forest-dark)', fontWeight: 700, fontSize: '0.8125rem' }}>
          <Filter size={16} />
          Filter:
        </div>

        {/* Status Select */}
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.8125rem', padding: '0 0.75rem' }}
        >
          <option value="all">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Category Select */}
        <select
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.8125rem', padding: '0 0.75rem' }}
        >
          <option value="all">All Categories</option>
          <option value="waste">Waste & Littering</option>
          <option value="water_leakage">Water Leakage</option>
          <option value="electricity">Electricity Wastage</option>
          <option value="sanitation">Sanitation & Hygiene</option>
          <option value="other">Other Campus Issues</option>
        </select>

        {/* Priority Select */}
        <select
          className="form-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ height: '36px', fontSize: '0.8125rem', padding: '0 0.75rem' }}
        >
          <option value="all">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <div className="catalog-search-wrap" style={{ marginLeft: 'auto', position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '30px', height: '36px', fontSize: '0.8125rem' }}
          />
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
          {filtered.length} of {reports.length} reports
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-emerald)',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <TreePine size={36} style={{ color: 'var(--primary)', margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.125rem', color: 'var(--forest-dark)', marginBottom: '0.5rem' }}>No Reports Match Selected Filters</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Try resetting the status, category, or search keywords.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onViewDetails={onViewDetails}
              onOpenFeedback={onOpenFeedback}
              onOpenResolve={onOpenResolve}
              onOpenAssign={onOpenAssign}
              onDeleteReport={onDeleteReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};
