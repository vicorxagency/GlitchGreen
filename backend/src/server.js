import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { authenticate } from './middleware/auth.js';
import { isSupabaseConfigured } from './config/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads for issue & resolution attachments
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Attach current user identity from headers/session
app.use(authenticate);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'GLITCHXGREEN API — Campus Environmental Issue Tracking System',
    supabaseConnected: isSupabaseConfigured,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Export app for Vercel services / serverless deployment
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌱 GLITCHXGREEN Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Database mode: ${isSupabaseConfigured ? 'Supabase Cloud PostgreSQL' : 'Integrated Local Store (Seed Data)'}`);
    console.log(`======================================================\n`);
  });
}
