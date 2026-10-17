import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/RoleBadge';
import {
  Users,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  KeyRound,
  RotateCw
} from 'lucide-react';
import { api } from '../services/api';

export const UserManagement = ({ users = [], onRefreshUsers }) => {
  const { currentUser } = useAuth();
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [newRole, setNewRole] = useState('staff');
  const [newDept, setNewDept] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [modalError, setModalError] = useState('');

  const safeUsers = Array.isArray(users) ? users : [];

  const handleRoleChange = async (userId, targetRole) => {
    try {
      const res = await api.updateUserRole(userId, targetRole);
      if (res.success) {
        setMsg({ text: `Role updated to ${targetRole} successfully.`, type: 'success' });
        if (onRefreshUsers) onRefreshUsers();
      } else {
        setMsg({ text: res.error || 'Failed to update user role', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Server error updating user role', type: 'error' });
    }
  };

  const handleDeleteUser = async (user) => {
    if (!user || user.id === currentUser?.id) return;
    const confirmed = window.confirm(`Are you sure you want to remove user "${user.full_name}" (${user.email})? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await api.deleteUser(user.id);
      if (res.success) {
        setMsg({ text: `User ${user.full_name} removed successfully.`, type: 'success' });
        if (onRefreshUsers) onRefreshUsers();
      } else {
        setMsg({ text: res.error || 'Failed to remove user account', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Server error removing user', type: 'error' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newEmail || !newName) return;

    if (!newPassword || newPassword.length < 6) {
      setModalError('Please enter a password with at least 6 characters.');
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    if (safeUsers.some(u => u.email && u.email.trim().toLowerCase() === cleanEmail)) {
      setModalError(`An account with email "${cleanEmail}" already exists. Each user must have a unique email address.`);
      return;
    }

    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await api.createUser({
        email: cleanEmail,
        full_name: newName.trim(),
        role: newRole,
        password: newPassword,
        department: newDept || (newRole === 'staff' ? 'Campus Facilities Team' : newRole === 'admin' ? 'Campus Administration' : 'Student Body')
      });

      if (res.success) {
        setMsg({ text: `User ${newName} created successfully as ${newRole}. Password has been set.`, type: 'success' });
        setShowAddModal(false);
        setNewEmail('');
        setNewName('');
        setNewPassword('');
        setNewDept('');
        setModalError('');
        if (onRefreshUsers) onRefreshUsers();
      } else {
        setModalError(res.error || 'Failed to create user');
      }
    } catch (err) {
      setModalError('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  // Deduplicate users list by email so each email has strictly one account
  const uniqueUsersList = React.useMemo(() => {
    const seen = new Set();
    return safeUsers.filter(u => {
      const em = (u.email || '').trim().toLowerCase();
      if (!em) return true;
      if (seen.has(em)) return false;
      seen.add(em);
      return true;
    });
  }, [safeUsers]);

  const filteredUsers = filterRole === 'all'
    ? uniqueUsersList
    : uniqueUsersList.filter(u => u.role === filterRole);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)' }}>GLITCHX<span style={{ color: '#059669' }}>GREEN</span> User & Role Directory</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Admin privileges: View and manage user accounts, assign roles (Student, Staff, Admin), set passwords, and onboard campus staff.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onRefreshUsers && (
            <button className="btn btn-outline" onClick={onRefreshUsers} title="Refresh directory">
              <RotateCw size={15} />
              <span>Refresh</span>
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} />
            Create New User
          </button>
        </div>
      </div>

      {msg.text && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          fontSize: '0.8125rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: msg.type === 'success' ? '#ecfdf5' : '#fee2e2',
          color: msg.type === 'success' ? '#047857' : '#b91c1c',
          border: `1px solid ${msg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {msg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Role Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Users (${uniqueUsersList.length})` },
          { id: 'student', label: `Students (${uniqueUsersList.filter(u => u.role === 'student').length})` },
          { id: 'staff', label: `Campus Staff (${uniqueUsersList.filter(u => u.role === 'staff').length})` },
          { id: 'admin', label: `Admins (${uniqueUsersList.filter(u => u.role === 'admin').length})` }
        ].map(btn => (
          <button
            key={btn.id}
            className={`btn btn-sm ${filterRole === btn.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterRole(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="eco-table-wrapper">
        <table className="eco-table">
          <thead>
            <tr>
              <th>User Name & Profile</th>
              <th>Email</th>
              <th>Department / Campus Affiliation</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <Users size={32} style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>No users found in this category</div>
                  <div style={{ fontSize: '0.8125rem' }}>Click &quot;Create New User&quot; above to onboard users with custom credentials.</div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email || u.id)}`}
                        alt={u.full_name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-emerald)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--forest-surface)' }}>
                          {u.full_name} {u.id === currentUser?.id && <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 800 }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {u.id.substring(0, 14)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.department || 'General Campus'}</td>
                  <td>
                    <RoleBadge role={u.role} />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}
                      disabled={u.id === currentUser?.id}
                    >
                      <option value="student">Student</option>
                      <option value="staff">Campus Staff</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {u.id !== currentUser?.id && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0.3rem 0.5rem' }}
                        onClick={() => handleDeleteUser(u)}
                        title={`Remove user ${u.full_name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} style={{ color: 'var(--emerald)' }} />
                <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)', margin: 0 }}>Add New Campus User</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {modalError && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca'
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Samuel Green"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="samuel.green@campus.edu"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Set Account Password *</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showModalPassword ? 'text' : 'password'}
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter initial password (min. 6 characters)"
                      minLength={6}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPassword(!showModalPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0
                      }}
                      tabIndex={-1}
                    >
                      {showModalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <small style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    The user will use this password along with their email to log in immediately.
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Assign Role *</label>
                  <select
                    className="form-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="student">Student (Submit issues & feedback)</option>
                    <option value="staff">Campus Staff (Resolve & maintenance)</option>
                    <option value="admin">Administrator (Full oversight)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Department / Unit</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="e.g. Electrical Maintenance / Biology Dept."
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
