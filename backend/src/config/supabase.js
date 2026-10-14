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
  }

  // USERS
  async getUsers(role = null) {
    let list = [];
    if (isSupabaseConfigured) {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (role) query = query.eq('role', role);
      const { data, error } = await query;
      if (!error && data) {
        list = data;
      } else {
        console.warn('Supabase profiles query error, using local data:', error?.message);
        list = role ? this.users.filter(u => u.role === role) : this.users;
      }
    } else {
      list = role ? this.users.filter(u => u.role === role) : this.users;
    }

    // Deduplicate users by email (case-insensitive) to prevent any duplicate accounts
    const seenEmails = new Set();
    const uniqueUsers = [];
    for (const u of list) {
      const emailLower = (u.email || '').trim().toLowerCase();
      if (emailLower && !seenEmails.has(emailLower)) {
        seenEmails.add(emailLower);
        uniqueUsers.push(u);
      } else if (!emailLower) {
        uniqueUsers.push(u);
      }
    }
    return uniqueUsers;
  }

  async getUserById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();
      if (!error && data) return data;
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

    const newUser = {
      id: userData.id || `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: userData.full_name || userData.name,
      role: userData.role || 'student',
      department: userData.department || 'Campus Community',
      avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      phone: userData.phone || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').insert([newUser]).select().single();
      if (!error && data) {
        this.users = this.users.filter(u => u.email?.toLowerCase() !== cleanEmail);
        this.users.unshift(data);
        return data;
      }
      console.warn('Supabase insert profile error, keeping in local store:', error?.message);
    }
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
      created_at: userData.created_at || new Date().toISOString()
    };

    // Update in local memory store: remove any conflicting entry by email or id, then add
    this.users = this.users.filter(u => u.email?.toLowerCase() !== cleanEmail && u.id !== userRecord.id);
    this.users.unshift(userRecord);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('profiles').upsert([userRecord], { onConflict: 'email' }).select().single();
        if (!error && data) {
          this.users = this.users.filter(u => u.email?.toLowerCase() !== cleanEmail && u.id !== data.id);
          this.users.unshift(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase profiles upsert notice:', err.message);
      }
    }
    return userRecord;
  }

  async updateUserRole(id, newRole) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], role: newRole };
      return this.users[idx];
    }
    return null;
  }

  // REPORTS
  async getReports({ status, category, priority, assigned_to, reported_by } = {}) {
    if (isSupabaseConfigured) {
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
      if (!error && data) return data;
      console.warn('Supabase reports fetch error, falling back to local store:', error?.message);
    }

    let results = [...this.reports];
    if (status) results = results.filter(r => r.status.toLowerCase() === status.toLowerCase());
    if (category) results = results.filter(r => r.category === category);
    if (priority) results = results.filter(r => r.priority === priority);
    if (assigned_to) results = results.filter(r => r.assigned_to === assigned_to);
    if (reported_by) results = results.filter(r => r.reported_by === reported_by);

    // Hydrate relations
    return results.map(r => ({
      ...r,
      reporter: this.users.find(u => u.id === r.reported_by) || null,
      assignee: this.users.find(u => u.id === r.assigned_to) || null,
      feedback: this.feedback.find(f => f.report_id === r.id) || null
    }));
  }

  async getReportById(id) {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();

    if (isSupabaseConfigured) {
      // 1. Try exact or ilike match in Supabase
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reported_by (id, full_name, email, avatar_url, role),
          assignee:assigned_to (id, full_name, email, avatar_url, role),
          feedback:feedback (*)
        `)
        .ilike('id', cleanId)
        .maybeSingle();

      if (!error && data) return data;
    }

    // 2. Search local memory store with flexible matching
    const report = this.reports.find(r => {
      const rid = (r.id || '').toUpperCase();
      return (
        rid === cleanId ||
        rid.replace(/^ECO-\d+-/, '') === cleanId ||
        rid.endsWith(`-${cleanId}`) ||
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

    const newReport = {
      id: generatedId,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category || 'other',
      location: reportData.location,
      image_url: reportData.image_url || null,
      status: 'Reported',
      priority: reportData.priority || 'Medium',
      reported_by: creatorId,
      reporter_name: reportData.reporter_name || (creatorId.startsWith('usr-') ? null : 'Campus Community Guest'),
      reporter_email: reportData.reporter_email || null,
      assigned_to: null,
      resolution_notes: null,
      resolution_image_url: null,
      estimated_hours: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reports').insert([newReport]).select().single();
      if (!error && data) {
        await this.addStatusLog({
          report_id: data.id,
          previous_status: null,
          new_status: 'Reported',
          changed_by: creatorId,
          notes: reportData.reporter_name ? `Report filed by ${reportData.reporter_name}` : 'Report filed'
        });
        return data;
      }
      console.warn('Supabase report insert error, falling back to local memory store:', error?.message);
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
    const cleanId = id.trim().toUpperCase();

    if (isSupabaseConfigured) {
      try {
        await supabase.from('feedback').delete().ilike('report_id', cleanId);
        await supabase.from('status_logs').delete().ilike('report_id', cleanId);
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
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      report_id: logData.report_id,
      previous_status: logData.previous_status || null,
      new_status: logData.new_status,
      changed_by: logData.changed_by,
      notes: logData.notes || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      await supabase.from('report_status_logs').insert([entry]);
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
