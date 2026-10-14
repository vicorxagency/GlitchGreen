import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/RoleBadge';
import { Users, UserPlus, Shield, Check, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const UserManagement = ({ users, onRefreshUsers }) => {
  const { currentUser } = useAuth();
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('staff');
  const [newDept, setNewDept] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [modalError, setModalError] = useState('');

  const handleRoleChange = async (userId, targetRole) => {
    try {
      const res = await api.updateUserRole(userId, targetRole);
      if (res.success) {
        setMsg({ text: `Role updated to ${targetRole} successfully.`, type: 'success' });
        onRefreshUsers();
      } else {
        setMsg({ text: res.error || 'Failed to update user role', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Server error updating user role', type: 'error' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!newEmail || !newName) return;

    const cleanEmail = newEmail.trim().toLowerCase();
    if (users && users.some(u => u.email && u.email.trim().toLowerCase() === cleanEmail)) {
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
        department: newDept || (newRole === 'staff' ? 'Campus Facilities Team' : 'Academic Dept.')
      });

      if (res.success) {
        setMsg({ text: `User ${newName} created successfully as ${newRole}.`, type: 'success' });
        setShowAddModal(false);
        setNewEmail('');
        setNewName('');
        setNewDept('');
        setModalError('');
        onRefreshUsers();
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
    return (users || []).filter(u => {
      const em = (u.email || '').trim().toLowerCase();
      if (!em) return true;
      if (seen.has(em)) return false;
      seen.add(em);
      return true;
    });
  }, [users]);

  const filteredUsers = filterRole === 'all'
    ? uniqueUsersList
    : uniqueUsersList.filter(u => u.role === filterRole);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--forest-dark)' }}>GLITCHX<span style={{ color: '#059669' }}>GREEN</span> User & Role Directory</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Admin privileges: View and manage user accounts, assign roles (Student, Staff, Admin), and onboard campus staff.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          Create New User
        </button>
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'all', label: `All Users (${users.length})` },
          { id: 'student', label: `Students (${users.filter(u => u.role === 'student').length})` },
          { id: 'staff', label: `Campus Staff (${users.filter(u => u.role === 'staff').length})` },
          { id: 'admin', label: `Admins (${users.filter(u => u.role === 'admin').length})` }
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
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.full_name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-emerald)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--forest-surface)' }}>{u.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {u.id}</div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-dark)' }}>Add New Campus User</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-dim)' }}>✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                {modalError && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
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
                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group">
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

              <div className="modal-footer">
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
