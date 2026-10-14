const API_BASE = '/api';

export const api = {
  // Helper to attach current user ID and Supabase Bearer token
  getHeaders(isFormData = false) {
    const currentUserId = localStorage.getItem('glitchxgreen_user_id');
    const token = localStorage.getItem('glitchxgreen_token');
    const headers = {};
    if (currentUserId) {
      headers['x-user-id'] = currentUserId;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },

  // REPORTS
  async getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/reports?${query}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getReportById(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createReport(formData) {
    // formData can be an instance of FormData with image file or object
    let body;
    let isFormData = false;

    if (formData instanceof FormData) {
      body = formData;
      isFormData = true;
    } else {
      body = JSON.stringify(formData);
    }

    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: this.getHeaders(isFormData),
      body
    });
    return res.json();
  },

  async updateReport(id, updates) {
    let body;
    let isFormData = false;

    if (updates instanceof FormData) {
      body = updates;
      isFormData = true;
    } else {
      body = JSON.stringify(updates);
    }

    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(isFormData),
      body
    });
    return res.json();
  },

  async assignReport(id, { assigned_to, priority, notes }) {
    const res = await fetch(`${API_BASE}/reports/${id}/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ assigned_to, priority, notes })
    });
    return res.json();
  },

  async getStatusLogs(reportId) {
    const res = await fetch(`${API_BASE}/reports/${reportId}/logs`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async deleteReport(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return res.json();
  },

  // FEEDBACK
  async submitFeedback(data) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getFeedbackForReport(reportId) {
    const res = await fetch(`${API_BASE}/feedback/report/${reportId}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // USERS & METRICS
  async getUsers(role = null) {
    const query = role ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/users${query}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async updateUserRole(id, role) {
    const res = await fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async getMetrics() {
    const res = await fetch(`${API_BASE}/users/metrics`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // AUTH & DEMO ROLES
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders()
    });
    return res.json();
  }
};

