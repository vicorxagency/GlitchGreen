import { supabase, isSupabaseConfigured, dbStore } from '../config/supabase.js';

// Official Credential Information for Graphic Era Roles
export const DEMO_CREDENTIALS = [
  {
    role: 'student',
    email: 'student@graphicera.ac.in',
    password: 'Password@123',
    id: 'ca54d1c2-02a3-4233-92b6-7a43a8364ba1',
    full_name: 'Alex Rivera',
    department: 'Computer Science & Engineering'
  },
  {
    role: 'staff',
    email: 'staff@graphicera.ac.in',
    password: 'Password@123',
    id: '4150a9ae-d9c0-4848-8168-f86b99749a20',
    full_name: 'Marcus Vance',
    department: 'Campus Facilities & Sanitation'
  },
  {
    role: 'admin',
    email: 'admin@graphicera.ac.in',
    password: 'Password@123',
    id: '637117f6-c84f-415b-b3ba-96a08b8847ba',
    full_name: 'Dr. Evelyn Hayes',
    department: 'Office of Campus Sustainability'
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
        email: email.trim().toLowerCase(),
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

    // 2. Fallback check against official demo credentials or local users
    const matchedDemo = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === cleanEmail && c.password === password
    );

    if (matchedDemo) {
      const profile = (await dbStore.getUserById(matchedDemo.id)) || {
        id: matchedDemo.id,
        email: matchedDemo.email,
        full_name: matchedDemo.full_name,
        role: matchedDemo.role,
        department: matchedDemo.department,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
      };

      return res.json({
        success: true,
        data: {
          user: profile,
          token: `token-${profile.id}`
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
    const student = users.find(u => u.role === 'student') || DEMO_CREDENTIALS[0];
    const staff = users.find(u => u.role === 'staff') || DEMO_CREDENTIALS[1];
    const admin = users.find(u => u.role === 'admin') || DEMO_CREDENTIALS[2];

    res.json({
      success: true,
      data: {
        all: users,
        defaults: {
          student,
          staff,
          admin
        },
        credentials: DEMO_CREDENTIALS
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
