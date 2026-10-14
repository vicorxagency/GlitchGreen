import express from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  assignReport,
  getStatusLogs,
  deleteReport
} from '../controllers/reportController.js';
import { upload } from '../middleware/upload.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all reports (supports filtering by ?status=&category=&view=my_assigned etc.)
router.get('/', getAllReports);

// GET report by ID
router.get('/:id', getReportById);

// GET audit logs for report
router.get('/:id/logs', getStatusLogs);

// POST report (student or staff or admin submitting an issue)
router.post('/', upload.single('image'), createReport);

// PATCH / PUT update report (status, notes, resolution details)
router.patch('/:id', upload.single('resolution_image'), updateReport);

// POST assign report to staff (Admin privilege)
router.post('/:id/assign', requireRole(['admin']), assignReport);

// DELETE report (Admin privilege only)
router.delete('/:id', requireRole(['admin']), deleteReport);

export default router;
