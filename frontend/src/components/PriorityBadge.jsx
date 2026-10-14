import React from 'react';
import { Flame, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'medium').toLowerCase();

  const getIcon = () => {
    switch (normalized) {
      case 'urgent':
        return <Flame size={12} />;
      case 'high':
        return <AlertTriangle size={12} />;
      case 'medium':
        return <ArrowUp size={12} />;
      case 'low':
        return <ArrowDown size={12} />;
      default:
        return null;
    }
  };

  return (
    <span className={`badge-priority ${normalized}`}>
      {getIcon()}
      {priority}
    </span>
  );
};
