import { supabase, isSupabaseConfigured, dbStore } from '../config/supabase.js';

// Real verified credentials
export const DEMO_CREDENTIALS = [
  {
    role: 'admin',
    email: 'kadiyanjatin28@gmail.com',
    password: 'Password@123',
    id: '7fc51e31-a141-4b9b-9216-ab06dbd4fdbc',
    full_name: 'Jatin Kadiyan',
    department: 'Office of Campus Administration'
  }
];

export const register = async (req, res) => {
  try {
    const { email, password, full_name, role = 'student', department, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Administrator accounts cannot be self-registered.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // STRICT CONDITION: Check if email already exists
    const existingUser = await dbStore.getUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: `An account with email "${cleanEmail}" already exists. Please sign in instead.`
      });
    }

    let authUser = null;
    let token = null;

    if (isSupabaseConfigured) {
      // Create user in Supabase Auth via admin API
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: full_name.trim(),
          role,
          department: department?.trim() || 'Campus Community',
          phone: phone?.trim() || ''
        }
      });

      if (createError) {
        return res.status(400).json({
          success: false,
          error: createError.message
        });
      }

      authUser = createData.user;

      // Authenticate to obtain active session
      const { data: sessionData } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      token = sessionData?.session?.access_token || null;
    }

    // Persist profile in local store / profiles table
    const profile = await dbStore.upsertUser({
      id: authUser?.id || `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: full_name.trim(),
      role,
      department: department?.trim() || 'Campus Community',
      phone: phone?.trim() || '',
      password,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: profile,
        token: token || `token-${profile.id}`
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth sign-in if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        const userMeta = data.user.user_metadata || {};
        let profile = (await dbStore.getUserById(data.user.id)) || (await dbStore.getUserByEmail(cleanEmail));

        if (!profile) {
          profile = await dbStore.upsertUser({
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: userMeta.full_name || cleanEmail.split('@')[0],
            role: userMeta.role || 'student',
            department: userMeta.department || 'Campus Community',
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
            phone: userMeta.phone || ''
          });
        } else {
          // Sync ID with Supabase Auth session
          profile.id = data.user.id;
        }

        return res.json({
          success: true,
          data: {
            user: profile,
            token: data.session?.access_token || `token-${profile.id}`
          }
        });
      }
    }

    // 2. Fallback check against verified credentials or local memory store
    const matchedDemo = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === cleanEmail && c.password === password
    );
    if (matchedDemo) {
      return res.json({
        success: true,
        data: {
          user: matchedDemo,
          token: `token-${matchedDemo.id}`
        }
      });
    }

    const localUser = await dbStore.getUserByEmail(cleanEmail);
    if (localUser && localUser.password && localUser.password === password) {
      return res.json({
        success: true,
        data: {
          user: localUser,
          token: `token-${localUser.id}`
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. Please verify your credentials.'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both campus email and your new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await dbStore.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `No user account found with email "${cleanEmail}".`
      });
    }

    await dbStore.updateUserPassword(user.id, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDemoAccounts = async (req, res) => {
  try {
    const users = await dbStore.getUsers();
    const student = users.find(u => u.role === 'student') || null;
    const staff = users.find(u => u.role === 'staff') || null;
    const admin = users.find(u => u.role === 'admin') || null;

    res.json({
      success: true,
      data: {
        all: users,
        defaults: {
          student,
          staff,
          admin
        },
        credentials: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
