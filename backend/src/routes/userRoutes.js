import express from 'express';
import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getMetrics
} from '../controllers/userController.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/metrics', getMetrics);
router.get('/', getUsers);
router.post('/', requireRole(['admin']), createUser);
router.patch('/:id/role', requireRole(['admin']), updateUserRole);
router.delete('/:id', requireRole(['admin']), deleteUser);

export default router;
