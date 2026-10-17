import express from 'express';
import {
  login,
  register,
  getCurrentUser,
  getDemoAccounts,
  resetPassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getCurrentUser);
router.get('/demo-accounts', getDemoAccounts);

export default router;
