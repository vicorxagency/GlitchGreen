import { dbStore } from '../config/supabase.js';

export const submitFeedback = async (req, res) => {
  try {
    const { report_id, is_properly_solved, satisfaction_rating, time_taken_rating, comments } = req.body;

    if (!report_id) {
      return res.status(400).json({ success: false, error: 'report_id is required' });
    }

    const report = await dbStore.getReportById(report_id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    if (report.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        error: `Cannot submit feedback for an issue that is not yet Resolved. Current status: ${report.status}`
      });
    }

    if (!is_properly_solved || !satisfaction_rating || !time_taken_rating) {
      return res.status(400).json({
        success: false,
        error: 'Please specify if properly solved (yes/partially/no), satisfaction rating (1-5), and time taken rating.'
      });
    }

    const studentId = req.user?.id || report.reported_by;

    const feedbackEntry = await dbStore.addFeedback({
      report_id,
      student_id: studentId,
      is_properly_solved,
      satisfaction_rating: Number(satisfaction_rating),
      time_taken_rating,
      comments: comments || ''
    });

    // Also add an audit log
    await dbStore.addStatusLog({
      report_id,
      previous_status: 'Resolved',
      new_status: 'Resolved',
      changed_by: studentId,
      notes: `Student submitted feedback: ${satisfaction_rating}★, Solved: ${is_properly_solved}, Timeliness: ${time_taken_rating}`
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback on the resolution has been recorded.',
      data: feedbackEntry
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFeedbackForReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const feedback = await dbStore.getFeedback(reportId);
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error fetching report feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await dbStore.getFeedback();
    res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
