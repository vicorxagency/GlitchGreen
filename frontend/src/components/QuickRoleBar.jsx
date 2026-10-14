import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Wrench, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export const QuickRoleBar = () => {
  const { role, currentUser, switchRole } = useAuth();

  return (
    <div className="quick-role-banner">
      <div className="quick-role-label-group">
        <Sparkles size={14} style={{ color: '#6ee7b7', flexShrink: 0 }} />
        <span className="quick-role-label-text">
          <span className="role-banner-full-text"><strong>Live Role Testing:</strong> Switch between the 3 roles:</span>
          <span className="role-banner-mobile-text"><strong>Role Testing:</strong></span>
        </span>
      </div>

      <div className="quick-role-buttons-wrap">
        <button
          className={`role-pill-btn ${role === 'student' ? 'active' : ''}`}
          onClick={() => switchRole('student')}
          title="Switch to Student view (Alex Rivera)"
        >
          <GraduationCap size={13} />
          <span>Student</span>
        </button>

        <button
          className={`role-pill-btn ${role === 'staff' ? 'active' : ''}`}
          onClick={() => switchRole('staff')}
          title="Switch to Staff view (Marcus Vance)"
        >
          <Wrench size={13} />
          <span>Staff</span>
        </button>

        <button
          className={`role-pill-btn ${role === 'admin' ? 'active' : ''}`}
          onClick={() => switchRole('admin')}
          title="Switch to Admin view (Dr. Evelyn Hayes)"
        >
          <ShieldCheck size={13} />
          <span>Admin</span>
        </button>

        <div className="quick-role-user-badge">
          <UserCheck size={13} style={{ color: '#a7f3d0' }} />
          <span>{currentUser?.full_name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
    </div>
  );
};
