import express from 'express';
import {
  submitFeedback,
  getFeedbackForReport,
  getAllFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/', getAllFeedback);
router.get('/report/:reportId', getFeedbackForReport);

export default router;
