import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Star, TreePine } from 'lucide-react';

export const MetricsGrid = ({ metrics }) => {
  const counts = metrics?.counts || {
    total: 0,
    reported: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0
  };

  const satisfaction = metrics?.satisfaction || {
    averageRating: 5.0,
    totalReviews: 1,
    resolutionAccuracyRate: 100
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon-wrap amber">
          <AlertCircle size={24} />
        </div>
        <div>
          <div className="metric-number">{counts.reported + counts.assigned}</div>
          <div className="metric-label">Pending / Triage</div>
          <div className="metric-delta">{counts.reported} awaiting assignment</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap indigo">
          <Clock size={24} />
        </div>
        <div>
          <div className="metric-number">{counts.in_progress}</div>
          <div className="metric-label">In Active Progress</div>
          <div className="metric-delta">Under repair by facility staff</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap emerald">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <div className="metric-number">{counts.resolved}</div>
          <div className="metric-label">Resolved Issues</div>
          <div className="metric-delta">Successfully remediated</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon-wrap primary">
          <Star size={24} />
        </div>
        <div>
          <div className="metric-number">{satisfaction.averageRating} ★</div>
          <div className="metric-label">Student Satisfaction</div>
          <div className="metric-delta">{satisfaction.resolutionAccuracyRate}% solved properly</div>
        </div>
      </div>
    </div>
  );
};
