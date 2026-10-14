import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ArrowRightCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'reported').toLowerCase().replace(' ', '-');

  const getIcon = () => {
    switch (normalized) {
      case 'reported':
        return <AlertCircle size={12} />;
      case 'assigned':
        return <ArrowRightCircle size={12} />;
      case 'in-progress':
        return <Clock size={12} />;
      case 'resolved':
        return <CheckCircle2 size={12} />;
      default:
        return <AlertCircle size={12} />;
    }
  };

  return (
    <span className={`badge-status ${normalized}`}>
      <span className="badge-status-dot"></span>
      {getIcon()}
      {status}
    </span>
  );
};
