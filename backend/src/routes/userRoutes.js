import express from 'express';
import {
  getUsers,
  createUser,
  updateUserRole,
  getMetrics
} from '../controllers/userController.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', getMetrics);
router.get('/', getUsers);
router.post('/', requireRole(['admin']), createUser);
router.patch('/:id/role', requireRole(['admin']), updateUserRole);

export default router;
