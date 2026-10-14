import React from 'react';
import { GraduationCap, Wrench, ShieldCheck } from 'lucide-react';

export const RoleBadge = ({ role }) => {
  const normalized = (role || 'student').toLowerCase();

  const getIcon = () => {
    switch (normalized) {
      case 'student':
        return <GraduationCap size={12} />;
      case 'staff':
        return <Wrench size={12} />;
      case 'admin':
        return <ShieldCheck size={12} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (normalized) {
      case 'student':
        return 'Student';
      case 'staff':
        return 'Campus Staff';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  return (
    <span className={`badge-role ${normalized}`}>
      {getIcon()}
      {getLabel()}
    </span>
  );
};
