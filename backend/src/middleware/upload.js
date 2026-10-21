import multer from 'multer';
import path from 'path';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname || '').toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed for campus issue attachments'));
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

/**
 * Persists an uploaded file either to Supabase Storage ('campus_uploads')
 * or falls back to an inline Base64 data URL.
 * Works seamlessly in read-only / serverless runtimes (Vercel) without disk dependencies.
 */
export async function processUploadedFile(file) {
  if (!file || !file.buffer) return null;

  // 1. Attempt upload to Supabase Storage bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
      const fileName = `eco-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

      const { data, error } = await supabase.storage
        .from('campus_uploads')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype || 'image/jpeg',
          upsert: true
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from('campus_uploads')
          .getPublicUrl(fileName);

        if (pubData?.publicUrl) {
          return pubData.publicUrl;
        }
      } else {
        console.warn('Supabase storage upload notice:', error?.message);
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload exception:', storageErr.message);
    }
  }

  // 2. Safe, universal serverless fallback: Base64 data URI
  const mime = file.mimetype || 'image/jpeg';
  return `data:${mime};base64,${file.buffer.toString('base64')}`;
}

