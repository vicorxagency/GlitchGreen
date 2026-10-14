import { dbStore } from '../config/supabase.js';

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await dbStore.getUsers(role);
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, full_name, role, department, phone, avatar_url } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ success: false, error: 'Email and full_name are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await dbStore.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `A user with email "${cleanEmail}" already exists in the system.`
      });
    }

    const newUser = await dbStore.createUser({
      email: cleanEmail,
      full_name: full_name.trim(),
      role: role || 'student',
      department,
      phone,
      avatar_url
    });

    res.status(201).json({
      success: true,
      message: `User ${full_name} created as ${newUser.role}`,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Role must be student, staff, or admin.'
      });
    }

    const updatedUser = await dbStore.updateUserRole(id, role);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const metrics = await dbStore.getMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error calculating metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
