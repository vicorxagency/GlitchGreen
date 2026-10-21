import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  initialUsers,
  initialCategories,
  initialReports,
  initialFeedback,
  initialStatusLogs
} from '../db/seedData.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (isSupabaseConfigured) {
  console.log('🌲 Supabase client initialized successfully with live database connection.');
} else {
  console.log('🌿 Supabase credentials not found or placeholder; initializing high-performance local memory store with campus seed data.');
}

// In-Memory Fallback State (when Supabase credentials are not yet supplied)
class LocalStore {
  constructor() {
    this.users = [...initialUsers];
    this.categories = [...initialCategories];
    this.reports = [...initialReports];
    this.feedback = [...initialFeedback];
    this.statusLogs = [...initialStatusLogs];
    if (isSupabaseConfigured) {
      this.syncProfilesTable().catch(() => {});
    }
  }

  async syncProfilesTable() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (!error && data?.users) {
        const payload = data.users.map(u => ({
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
          role: u.user_metadata?.role || 'student',
          department: u.user_metadata?.department || 'Campus Community',
          phone: u.user_metadata?.phone || '',
          avatar_url: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email || u.id)}`
        }));
        if (payload.length > 0) {
          await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
        }
      }
    } catch (e) {
      // non-fatal
    }
  }

  // USERS
  async getUsers(role = null) {
    let list = [];
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error && data?.users) {
          list = data.users.map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
            role: u.user_metadata?.role || 'student',
            department: u.user_metadata?.department || 'Campus Community',
            phone: u.user_metadata?.phone || '',
            avatar_url: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email)}`,
            created_at: u.created_at
          }));
          this.syncProfilesTable().catch(() => {});
        } else {
          // If profiles table happens to exist, fallback to query
          const { data: profData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
          if (profData) list = profData;
        }
      } catch (err) {
        console.warn('Supabase auth.admin.listUsers error:', err.message);
      }
    }

    // Merge with any in-memory users that might not be in auth (deduplicate by email)
    const combined = [...list];
    for (const localU of this.users) {
      if (!combined.some(u => u.email?.toLowerCase() === localU.email?.toLowerCase())) {
        combined.push(localU);
      }
    }

    const filtered = role ? combined.filter(u => u.role === role) : combined;
    return filtered;
  }

  async getUserById(id) {
    if (!id) return null;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.admin.getUserById(id);
        if (!error && data?.user) {
          const u = data.user;
          return {
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
            role: u.user_metadata?.role || 'student',
            department: u.user_metadata?.department || 'Campus Community',
            phone: u.user_metadata?.phone || '',
            avatar_url: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email)}`,
            created_at: u.created_at
          };
        }
      } catch (e) {
        // silent fallback
      }
    }
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error && data?.users) {
          const u = data.users.find(usr => usr.email && usr.email.trim().toLowerCase() === cleanEmail);
          if (u) {
            return {
              id: u.id,
              email: u.email,
              full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
              role: u.user_metadata?.role || 'student',
              department: u.user_metadata?.department || 'Campus Community',
              phone: u.user_metadata?.phone || '',
              avatar_url: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email)}`,
              created_at: u.created_at
            };
          }
        }
      } catch (e) {
        // silent fallback
      }
    }
    return this.users.find(u => u.email && u.email.trim().toLowerCase() === cleanEmail) || null;
  }

  async createUser(userData) {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    // STRICT UNIQUE EMAIL CONDITION: Block if email already has an account
    const existing = await this.getUserByEmail(cleanEmail);
    if (existing) {
      const err = new Error(`An account with email "${cleanEmail}" already exists.`);
      err.code = 'EMAIL_EXISTS';
      throw err;
    }

    let authUser = null;
    if (isSupabaseConfigured) {
      const passwordToUse = userData.password || 'Campus@123';
      const { data, error } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: passwordToUse,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name || userData.name,
          role: userData.role || 'student',
          department: userData.department || 'Campus Community',
          phone: userData.phone || '',
          avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
        }
      });
      if (error) {
        throw new Error(error.message);
      }
      authUser = data?.user;
      if (authUser?.id) {
        try {
          await supabase.from('profiles').upsert([{
            id: authUser.id,
            email: cleanEmail,
            full_name: userData.full_name || userData.name,
            role: userData.role || 'student',
            department: userData.department || 'Campus Community',
            phone: userData.phone || '',
            avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
          }], { onConflict: 'id' });
        } catch (e) {
          console.warn('Profiles upsert note:', e.message);
        }
      }
    }

    const newUser = {
      id: authUser?.id || userData.id || `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: userData.full_name || userData.name,
      role: userData.role || 'student',
      department: userData.department || 'Campus Community',
      avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      phone: userData.phone || '',
      password: userData.password,
      created_at: new Date().toISOString()
    };

    this.users = this.users.filter(u => u.email?.toLowerCase() !== cleanEmail);
    this.users.unshift(newUser);
    return newUser;
  }

  async upsertUser(userData) {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email address is required.');
    }

    const userRecord = {
      id: userData.id || `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: userData.full_name || userData.name || cleanEmail.split('@')[0],
      role: userData.role || 'student',
      department: userData.department || 'Campus Community',
      avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      phone: userData.phone || '',
      password: userData.password,
      created_at: userData.created_at || new Date().toISOString()
    };

    this.users = this.users.filter(u => u.email?.toLowerCase() !== cleanEmail && u.id !== userRecord.id);
    this.users.unshift(userRecord);

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.admin.updateUserById(userRecord.id, {
          user_metadata: {
            full_name: userRecord.full_name,
            role: userRecord.role,
            department: userRecord.department,
            phone: userRecord.phone,
            avatar_url: userRecord.avatar_url
          }
        });
        await supabase.from('profiles').upsert([{
          id: userRecord.id,
          email: cleanEmail,
          full_name: userRecord.full_name,
          role: userRecord.role,
          department: userRecord.department,
          phone: userRecord.phone,
          avatar_url: userRecord.avatar_url
        }], { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase auth user update notice:', err.message);
      }
    }
    return userRecord;
  }

  async updateUserRole(id, newRole) {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: { role: newRole }
        });
      } catch (err) {
        console.warn('Supabase update role error:', err.message);
      }
    }
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], role: newRole };
      return this.users[idx];
    }
    const user = await this.getUserById(id);
    if (user) {
      user.role = newRole;
      this.users.unshift(user);
      return user;
    }
    return null;
  }

  async updateUserPassword(idOrEmail, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    let targetUser = await this.getUserByEmail(idOrEmail);
    if (!targetUser) {
      targetUser = await this.getUserById(idOrEmail);
    }
    if (!targetUser) {
      throw new Error('No account found with this email or ID.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.admin.updateUserById(targetUser.id, {
        password: newPassword
      });
      if (error) {
        throw new Error(error.message);
      }
    }

    const localIdx = this.users.findIndex(u => u.id === targetUser.id || u.email?.toLowerCase() === targetUser.email?.toLowerCase());
    if (localIdx !== -1) {
      this.users[localIdx].password = newPassword;
    }
    return targetUser;
  }

  async deleteUser(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.admin.deleteUser(id);
      } catch (err) {
        console.warn('Supabase delete user error:', err.message);
      }
    }
    this.users = this.users.filter(u => u.id !== id);
    return true;
  }

  // REPORTS
  async getReports({ status, category, priority, assigned_to, reported_by } = {}) {
    let supabaseReports = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('reports')
          .select(`
            *,
            reporter:reported_by (id, full_name, email, avatar_url, role),
            assignee:assigned_to (id, full_name, email, avatar_url, role),
            feedback:feedback (*)
          `)
          .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (category) query = query.eq('category', category);
        if (priority) query = query.eq('priority', priority);
        if (assigned_to) query = query.eq('assigned_to', assigned_to);
        if (reported_by) query = query.eq('reported_by', reported_by);

        const { data, error } = await query;
        if (!error && data) {
          supabaseReports = data.map(r => ({
            ...r,
            reporter: r.reporter || {
              id: r.reported_by || 'guest',
              full_name: r.reporter_name || 'Campus Community Member',
              email: r.reporter_email || '',
              role: 'guest',
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(r.reporter_name || 'guest')}`
            }
          }));
        } else if (error) {
          console.warn('Supabase reports fetch error, falling back to local store:', error?.message);
        }
      } catch (err) {
        console.warn('Supabase reports query exception:', err.message);
      }
    }

    // Merge with any in-memory reports
    let localFiltered = [...this.reports];
    if (status) localFiltered = localFiltered.filter(r => r.status?.toLowerCase() === status.toLowerCase());
    if (category) localFiltered = localFiltered.filter(r => r.category === category);
    if (priority) localFiltered = localFiltered.filter(r => r.priority === priority);
    if (assigned_to) localFiltered = localFiltered.filter(r => r.assigned_to === assigned_to);
    if (reported_by) localFiltered = localFiltered.filter(r => r.reported_by === reported_by);

    const hydratedLocal = localFiltered.map(r => ({
      ...r,
      reporter: this.users.find(u => u.id === r.reported_by) || {
        id: r.reported_by || 'guest',
        full_name: r.reporter_name || 'Campus Community Guest',
        email: r.reporter_email || '',
        role: 'guest',
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(r.reporter_name || 'guest')}`
      },
      assignee: this.users.find(u => u.id === r.assigned_to) || null,
      feedback: this.feedback.find(f => f.report_id === r.id) || null
    }));

    const combined = [...supabaseReports];
    for (const lr of hydratedLocal) {
      if (!combined.some(r => (r.id || '').toUpperCase() === (lr.id || '').toUpperCase())) {
        combined.push(lr);
      }
    }

    combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return combined;
  }

  async getReportById(id) {
    if (!id) return null;
    const raw = String(id).trim();
    // Strip leading hash symbols (e.g. #ECO-2026-1025 -> ECO-2026-1025)
    const cleanId = raw.replace(/^#+/, '').trim().toUpperCase();
    if (!cleanId) return null;

    if (isSupabaseConfigured) {
      try {
        // 1. Try exact or ilike match in Supabase
        let { data, error } = await supabase
          .from('reports')
          .select(`
            *,
            reporter:reported_by (id, full_name, email, avatar_url, role),
            assignee:assigned_to (id, full_name, email, avatar_url, role),
            feedback:feedback (*)
          `)
          .ilike('id', cleanId)
          .maybeSingle();

        // 2. If not found, try matching by suffix or number (e.g. "1025" or "2026-1025")
        if (!data) {
          const { data: searchResults } = await supabase
            .from('reports')
            .select(`
              *,
              reporter:reported_by (id, full_name, email, avatar_url, role),
              assignee:assigned_to (id, full_name, email, avatar_url, role),
              feedback:feedback (*)
            `)
            .or(`id.ilike.%-${cleanId},id.ilike.%${cleanId}`)
            .limit(1);

          if (searchResults && searchResults.length > 0) {
            data = searchResults[0];
          }
        }

        if (data) {
          return {
            ...data,
            reporter: data.reporter || {
              id: data.reported_by || 'guest',
              full_name: data.reporter_name || 'Campus Community Member',
              email: data.reporter_email || '',
              role: 'guest',
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.reporter_name || 'guest')}`
            }
          };
        }
      } catch (err) {
        console.warn('Supabase getReportById exception:', err.message);
      }
    }

    // 3. Search local memory store with flexible matching
    const report = this.reports.find(r => {
      const rid = (r.id || '').toUpperCase();
      return (
        rid === cleanId ||
        rid.replace(/^ECO-\d+-/, '') === cleanId ||
        rid.endsWith(`-${cleanId}`) ||
        rid.endsWith(cleanId) ||
        cleanId.endsWith(rid)
      );
    });

    if (!report) return null;

    const reporterObj = this.users.find(u => u.id === report.reported_by) || {
      id: report.reported_by || 'guest',
      full_name: report.reporter_name || 'Campus Community Guest',
      email: report.reporter_email || '',
      role: 'guest',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(report.reporter_name || 'guest')}`
    };

    return {
      ...report,
      reporter: reporterObj,
      assignee: this.users.find(u => u.id === report.assigned_to) || null,
      feedback: this.feedback.find(f => f.report_id === report.id) || null
    };
  }

  async createReport(reportData, creatorId) {
    const currentYear = new Date().getFullYear();
    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    const generatedId = reportData.id || `ECO-${currentYear}-${randomTicket}`;

    const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    const reporterName = reportData.reporter_name || (creatorId?.startsWith?.('usr-') ? null : 'Campus Community Guest');
    const reporterEmail = reportData.reporter_email || null;

    const newReport = {
      id: generatedId,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category || 'other',
      location: reportData.location,
      image_url: reportData.image_url || null,
      status: 'Reported',
      priority: reportData.priority || 'Medium',
      reported_by: isUUID(creatorId) ? creatorId : null,
      reporter_name: reporterName,
      reporter_email: reporterEmail,
      assigned_to: null,
      resolution_notes: null,
      resolution_image_url: null,
      estimated_hours: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        // Ensure profile exists in profiles table if creatorId is a UUID to avoid foreign key errors
        if (isUUID(creatorId)) {
          const { data: existingProf } = await supabase.from('profiles').select('id').eq('id', creatorId).maybeSingle();
          if (!existingProf) {
            const userObj = await this.getUserById(creatorId);
            if (userObj) {
              await supabase.from('profiles').upsert([{
                id: creatorId,
                email: userObj.email,
                full_name: userObj.full_name || reporterName,
                role: userObj.role || 'student',
                department: userObj.department || 'Campus Community',
                phone: userObj.phone || '',
                avatar_url: userObj.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userObj.email || creatorId)}`
              }], { onConflict: 'id' });
            }
          }
        }

        let { data, error } = await supabase.from('reports').insert([newReport]).select().single();

        // If insert failed due to foreign key or user relation, retry with reported_by = null so report is NEVER lost
        if (error && newReport.reported_by) {
          console.warn('Supabase insert with reported_by failed (' + error.message + '), retrying with null reported_by...');
          const fallbackPayload = {
            ...newReport,
            reported_by: null,
            reporter_name: reporterName || 'Campus Community Guest'
          };
          const retryRes = await supabase.from('reports').insert([fallbackPayload]).select().single();
          if (!retryRes.error && retryRes.data) {
            data = retryRes.data;
            error = null;
          }
        }

        if (!error && data) {
          await this.addStatusLog({
            report_id: data.id,
            previous_status: null,
            new_status: 'Reported',
            changed_by: isUUID(creatorId) ? creatorId : null,
            notes: reportData.reporter_name ? `Report filed by ${reportData.reporter_name}` : 'Report filed'
          });

          this.reports.unshift(data);

          return {
            ...data,
            reporter: {
              id: data.reported_by || 'guest',
              full_name: data.reporter_name || reportData.reporter_name || 'Campus Community Guest',
              email: data.reporter_email || reportData.reporter_email || '',
              role: 'guest',
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.reporter_name || 'guest')}`
            }
          };
        }
        console.warn('Supabase report insert notice, falling back to local memory store:', error?.message);
      } catch (err) {
        console.warn('Supabase report insert exception, falling back:', err.message);
      }
    }

    this.reports.unshift(newReport);
    await this.addStatusLog({
      report_id: newReport.id,
      previous_status: null,
      new_status: 'Reported',
      changed_by: creatorId,
      notes: reportData.reporter_name ? `Report filed by ${reportData.reporter_name}` : 'Report filed'
    });
    return this.getReportById(newReport.id);
  }

  async updateReport(id, updates, changedById) {
    const current = await this.getReportById(id);
    if (!current) return null;

    const previousStatus = current.status;
    const isResolving = updates.status === 'Resolved' && previousStatus !== 'Resolved';

    const merged = {
      ...current,
      ...updates,
      resolved_at: isResolving ? new Date().toISOString() : (updates.status && updates.status !== 'Resolved' ? null : current.resolved_at),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('reports')
        .update({
          title: merged.title,
          description: merged.description,
          category: merged.category,
          location: merged.location,
          status: merged.status,
          priority: merged.priority,
          assigned_to: merged.assigned_to,
          resolution_notes: merged.resolution_notes,
          resolution_image_url: merged.resolution_image_url,
          estimated_hours: merged.estimated_hours,
          resolved_at: merged.resolved_at,
          updated_at: merged.updated_at
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        if (updates.status && updates.status !== previousStatus) {
          await this.addStatusLog({
            report_id: id,
            previous_status: previousStatus,
            new_status: updates.status,
            changed_by: changedById || 'system',
            notes: updates.notes || `Status transitioned to ${updates.status}`
          });
        }
        return this.getReportById(id);
      }
      console.warn('Supabase report update error:', error?.message);
    }

    const idx = this.reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.reports[idx] = {
        id: merged.id,
        title: merged.title,
        description: merged.description,
        category: merged.category,
        location: merged.location,
        image_url: merged.image_url,
        status: merged.status,
        priority: merged.priority,
        reported_by: merged.reported_by,
        assigned_to: merged.assigned_to,
        resolution_notes: merged.resolution_notes,
        resolution_image_url: merged.resolution_image_url,
        estimated_hours: merged.estimated_hours,
        resolved_at: merged.resolved_at,
        created_at: merged.created_at,
        updated_at: merged.updated_at
      };

      if (updates.status && updates.status !== previousStatus) {
        await this.addStatusLog({
          report_id: id,
          previous_status: previousStatus,
          new_status: updates.status,
          changed_by: changedById || 'system',
          notes: updates.notes || `Status transitioned to ${updates.status}`
        });
      }
    }
    return this.getReportById(id);
  }

  async deleteReport(id) {
    if (!id) return false;
    const cleanId = String(id).replace(/^#+/, '').trim().toUpperCase();

    if (isSupabaseConfigured) {
      try {
        await supabase.from('feedback').delete().ilike('report_id', cleanId);
        await supabase.from('report_status_logs').delete().ilike('report_id', cleanId);
        const { error } = await supabase.from('reports').delete().ilike('id', cleanId);
        if (error) console.warn('Supabase delete report notice:', error.message);
      } catch (err) {
        console.warn('Supabase delete report error:', err.message);
      }
    }

    this.reports = this.reports.filter(r => (r.id || '').toUpperCase() !== cleanId);
    this.statusLogs = this.statusLogs.filter(l => (l.report_id || '').toUpperCase() !== cleanId);
    this.feedback = this.feedback.filter(f => (f.report_id || '').toUpperCase() !== cleanId);
    return true;
  }

  // STATUS AUDIT LOGS
  async addStatusLog(logData) {
    const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      report_id: logData.report_id,
      previous_status: logData.previous_status || null,
      new_status: logData.new_status,
      changed_by: logData.changed_by || null,
      notes: logData.notes || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const supabaseLogEntry = {
          ...entry,
          changed_by: isUUID(entry.changed_by) ? entry.changed_by : null
        };
        await supabase.from('report_status_logs').insert([supabaseLogEntry]);
      } catch (err) {
        // silent fallback
      }
    }
    this.statusLogs.unshift(entry);
    return entry;
  }

  async getStatusLogs(reportId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('report_status_logs')
        .select(`*, changer:changed_by(id, full_name, role)`)
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return this.statusLogs
      .filter(l => l.report_id === reportId)
      .map(l => ({
        ...l,
        changer: this.users.find(u => u.id === l.changed_by) || null
      }));
  }

  // FEEDBACK
  async addFeedback(feedbackData) {
    const entry = {
      id: `fdb-${Date.now()}`,
      report_id: feedbackData.report_id,
      student_id: feedbackData.student_id,
      is_properly_solved: feedbackData.is_properly_solved, // 'yes', 'partially', 'no'
      satisfaction_rating: Number(feedbackData.satisfaction_rating), // 1-5
      time_taken_rating: feedbackData.time_taken_rating, // 'faster_than_expected', 'acceptable', 'too_slow'
      comments: feedbackData.comments || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('feedback').insert([entry]).select().single();
      if (!error && data) return data;
      console.warn('Supabase feedback insert error:', error?.message);
    }

    // Check if feedback already exists for this report
    const existingIndex = this.feedback.findIndex(f => f.report_id === entry.report_id);
    if (existingIndex !== -1) {
      this.feedback[existingIndex] = entry;
    } else {
      this.feedback.unshift(entry);
    }
    return entry;
  }

  async getFeedback(reportId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('feedback').select(`*, student:student_id(id, full_name, email)`);
      if (reportId) query = query.eq('report_id', reportId);
      const { data, error } = await query;
      if (!error && data) return reportId ? data[0] : data;
    }
    if (reportId) {
      const fb = this.feedback.find(f => f.report_id === reportId);
      return fb ? { ...fb, student: this.users.find(u => u.id === fb.student_id) } : null;
    }
    return this.feedback.map(f => ({
      ...f,
      student: this.users.find(u => u.id === f.student_id)
    }));
  }

  // ANALYTICS & STATS
  async getMetrics() {
    const allReports = await this.getReports();
    const allFeedback = await this.getFeedback();
    const allUsers = await this.getUsers();

    const counts = {
      total: allReports.length,
      reported: allReports.filter(r => r.status === 'Reported').length,
      assigned: allReports.filter(r => r.status === 'Assigned').length,
      in_progress: allReports.filter(r => r.status === 'In Progress').length,
      resolved: allReports.filter(r => r.status === 'Resolved').length
    };

    const categoriesCount = {};
    for (const cat of this.categories) {
      categoriesCount[cat.id] = {
        name: cat.name,
        count: allReports.filter(r => r.category === cat.id).length
      };
    }

    // Satisfaction calculation
    const avgRating = allFeedback.length > 0
      ? (allFeedback.reduce((acc, curr) => acc + (curr.satisfaction_rating || 0), 0) / allFeedback.length).toFixed(1)
      : '5.0';

    const properlySolvedCount = allFeedback.filter(f => f.is_properly_solved === 'yes').length;
    const resolutionAccuracyRate = allFeedback.length > 0
      ? Math.round((properlySolvedCount / allFeedback.length) * 100)
      : 100;

    return {
      counts,
      categoriesCount,
      satisfaction: {
        averageRating: Number(avgRating),
        totalReviews: allFeedback.length,
        resolutionAccuracyRate,
        properlySolvedCount
      },
      userCounts: {
        total: allUsers.length,
        students: allUsers.filter(u => u.role === 'student').length,
        staff: allUsers.filter(u => u.role === 'staff').length,
        admins: allUsers.filter(u => u.role === 'admin').length
      }
    };
  }
}

export const dbStore = new LocalStore();
