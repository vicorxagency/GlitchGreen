import { supabase, isSupabaseConfigured, dbStore } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (isSupabaseConfigured && token && !token.startsWith('token-')) {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          let user = await dbStore.getUserById(data.user.id);
          if (!user) {
            user = {
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
              role: data.user.user_metadata?.role || 'student',
              department: data.user.user_metadata?.department || 'Campus Community',
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.user.email)}`
            };
          }
          req.user = user;
          return next();
        }
      }
    }

    const userId = req.headers['x-user-id'] || req.query.current_user_id;
    if (userId) {
      const user = await dbStore.getUserById(userId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    req.user = null;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    next();
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`
      });
    }

    next();
  };
};
