import { dbStore } from '../config/supabase.js';

export const getAllReports = async (req, res) => {
  try {
    const { status, category, priority, assigned_to, reported_by, view } = req.query;
    const currentUserId = req.user?.id;
    const userRole = req.user?.role;

    let filterAssigned = assigned_to;
    let filterReported = reported_by;

    // Smart role-based presets if requested
    if (view === 'my_assigned' && currentUserId) {
      filterAssigned = currentUserId;
    } else if (view === 'my_reports' && currentUserId) {
      filterReported = currentUserId;
    }

    const reports = await dbStore.getReports({
      status,
      category,
      priority,
      assigned_to: filterAssigned,
      reported_by: filterReported
    });

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await dbStore.getReportById(id);

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const statusLogs = await dbStore.getStatusLogs(id);

    res.json({
      success: true,
      data: {
        ...report,
        statusLogs
      }
    });
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { title, description, category, location, priority, image_url, reporter_name, reporter_email } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and campus location are required.'
      });
    }

    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const reporterId = req.user?.id || (reporter_name ? `guest-${Date.now()}` : 'guest-visitor');

    const newReport = await dbStore.createReport(
      {
        title,
        description,
        category: category || 'other',
        location,
        priority: priority || 'Medium',
        image_url: finalImageUrl,
        reporter_name: req.user?.full_name || reporter_name || 'Campus Guest',
        reporter_email: req.user?.email || reporter_email || null
      },
      reporterId
    );

    res.status(201).json({
      success: true,
      message: 'Campus environmental issue reported successfully!',
      data: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      resolution_notes,
      resolution_image_url,
      estimated_hours,
      assigned_to,
      priority,
      notes
    } = req.body;

    const existing = await dbStore.getReportById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    let finalResolutionImg = resolution_image_url || existing.resolution_image_url;
    if (req.file) {
      finalResolutionImg = `/uploads/${req.file.filename}`;
    }

    const updates = {};
    if (status) updates.status = status;
    if (resolution_notes !== undefined) updates.resolution_notes = resolution_notes;
    if (finalResolutionImg) updates.resolution_image_url = finalResolutionImg;
    if (estimated_hours !== undefined) updates.estimated_hours = Number(estimated_hours);
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (priority) updates.priority = priority;
    if (notes) updates.notes = notes;

    // When staff resolves an issue, ensure notes explain the solution
    if (status === 'Resolved' && !resolution_notes && !existing.resolution_notes) {
      updates.resolution_notes = 'Issue addressed and resolved by campus facility staff.';
    }

    const updated = await dbStore.updateReport(id, updates, req.user?.id);

    res.json({
      success: true,
      message: `Report ${id} updated to status "${updated.status}"`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const assignReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to, priority, notes } = req.body;

    if (!assigned_to) {
      return res.status(400).json({ success: false, error: 'assigned_to staff user ID is required.' });
    }

    const staffUser = await dbStore.getUserById(assigned_to);
    if (!staffUser) {
      return res.status(400).json({ success: false, error: 'Assigned staff user not found.' });
    }

    const updates = {
      assigned_to,
      status: 'Assigned',
      notes: notes || `Assigned to ${staffUser.full_name} (${staffUser.department}) by ${req.user?.full_name || 'Admin'}`
    };

    if (priority) updates.priority = priority;

    const updated = await dbStore.updateReport(id, updates, req.user?.id);

    res.json({
      success: true,
      message: `Report assigned to ${staffUser.full_name}`,
      data: updated
    });
  } catch (error) {
    console.error('Error assigning report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStatusLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await dbStore.getStatusLogs(id);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await dbStore.getReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: `Report ${id} not found.`
      });
    }

    await dbStore.deleteReport(id);

    res.json({
      success: true,
      message: `Report ${id} ("${report.title}") has been permanently deleted.`
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
