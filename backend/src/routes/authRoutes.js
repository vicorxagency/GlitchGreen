import express from 'express';
import {
  login,
  register,
  getCurrentUser,
  getDemoAccounts
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);
router.get('/demo-accounts', getDemoAccounts);

export default router;
