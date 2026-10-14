# 🌱 GLITCHXGREEN — Campus Environmental Issue Tracking System

**GLITCHXGREEN** is the official campus sustainability and environmental issue tracking platform designed for the university climate hackathon. It represents the intersection of technology, innovation, and environmental sustainability — a modern digital platform that helps build a cleaner, greener campus.

Built with **React.js**, **Node.js (Express)**, and **Supabase (PostgreSQL)**, featuring the **"Verdant Pulse"** botanical design system designed with **Stitch MCP** and nature-inspired micro-animations.

---

## 🌟 Key Highlights & Role Capabilities

The system provides 3 role-based portals with continuous real-time synchronization:

### 🎓 1. Student Portal (`student`)
- **Submit Environmental Reports**: Report hazards like overflowing dustbins, water leakage, sanitation problems, or electricity wastage with photos, campus location, urgency level, and detailed descriptions.
- **Track Status Progression**: Real-time 4-step pipeline: `Reported` → `Assigned` → `In Progress` → `Resolved`.
- **Resolution Verification & Feedback**:
  - Rate whether the issue was **properly solved** (*Yes, Fully Solved* / *Partially Fixed* / *Not Solved*).
  - Rate **overall satisfaction** (1 to 5 Stars).
  - Assess **time taken to fix** (*Faster than expected* / *Reasonable/On Time* / *Too Slow/Delayed*).
  - Provide feedback remarks directly to campus facilities.

### 🔧 2. Staff Portal (`staff`)
- **Assigned Maintenance Queue**: Dedicated task list for facility and sanitation staff.
- **Claim & Triage**: Self-assign or accept campus issues awaiting repairs.
- **Update Status & Resolution Proof**:
  - Transition tickets (`Assigned` → `In Progress` → `Resolved`).
  - Add resolution notes explaining repairs performed.
  - Record actual hours spent.
  - Upload completion photo proof.

### 🛡️ 3. Admin Command Center (`admin`)
- **Full Report Management**: Prioritize, override status, and audit all campus incident tickets.
- **Staff Assignment & Workload Tracking**: View real-time work queues per staff member and assign unassigned issues.
- **User & Role Directory**: View all campus accounts (students, staff, admin), change roles inline, and register new personnel.
- **Campus Sustainability Analytics**: Monitor resolution rate, recurring category trends, and average student satisfaction ratings.

---

## 🏗️ Architecture & Project Structure

```
d:\vicorx\adiii/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js        # Supabase client + local fallback data store
│   │   ├── controllers/
│   │   │   ├── authController.js     # Demo accounts & session profile
│   │   │   ├── reportController.js   # Issue reporting, assignment, status update
│   │   │   ├── feedbackController.js # Student ratings & resolution audits
│   │   │   └── userController.js     # User directory & campus metrics
│   │   ├── db/
│   │   │   ├── schema.sql            # Supabase PostgreSQL schema & RLS policies
│   │   │   └── seedData.js           # Seed data for campus users & reports
│   │   ├── middleware/
│   │   │   ├── auth.js               # Multi-role access control middleware
│   │   │   └── upload.js             # Multer photo attachment handler
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── feedbackRoutes.js
│   │   │   └── userRoutes.js
│   │   └── server.js                 # Express server entry point
│   ├── uploads/                      # Photo uploads storage
│   ├── .env                          # Backend environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QuickRoleBar.jsx      # 1-Click live role switcher for testing
│   │   │   ├── Navbar.jsx            # EcoTrack branding, search & actions
│   │   │   ├── Sidebar.jsx           # Role-tailored navigation
│   │   │   ├── StatusBadge.jsx       # Reported, Assigned, In Progress, Resolved
│   │   │   ├── PriorityBadge.jsx     # Low, Medium, High, Urgent
│   │   │   ├── RoleBadge.jsx         # Student, Staff, Admin pills
│   │   │   ├── MetricsGrid.jsx       # Campus environmental summary stats
│   │   │   ├── ReportCard.jsx        # Issue cards with contextual actions
│   │   │   ├── CreateReportModal.jsx # Student report submission modal
│   │   │   ├── FeedbackModal.jsx     # Resolution rating & timeliness modal
│   │   │   ├── ResolveReportModal.jsx# Staff status & proof modal
│   │   │   ├── AssignStaffModal.jsx  # Admin staff dispatch modal
│   │   │   └── ReportDetailsModal.jsx# Full ticket breakdown & audit logs
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Role state & user session
│   │   ├── pages/
│   │   │   ├── StudentDashboard.jsx  # Student hub
│   │   │   ├── StaffDashboard.jsx    # Staff work queue
│   │   │   ├── AdminDashboard.jsx    # Executive oversight
│   │   │   ├── ReportsCatalog.jsx    # Complete filtered issue catalog
│   │   │   ├── UserManagement.jsx    # User directory & role editor
│   │   │   └── CampusAnalytics.jsx   # Metrics, charts & sustainability stats
│   │   ├── services/
│   │   │   ├── api.js                # REST client for backend endpoints
│   │   │   └── supabaseClient.js     # Supabase client config
│   │   ├── styles/
│   │   │   └── index.css             # "Verdant Pulse" design system tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on: `http://localhost:5000`*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🗄️ Supabase Database Setup

The backend runs automatically out-of-the-box using the built-in campus seed data. To sync with your remote Supabase cloud project:

1. Create a new project in your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** tab in Supabase.
3. Paste and run the entire SQL script from [`backend/src/db/schema.sql`](file:///d:/vicorx/adiii/backend/src/db/schema.sql).
4. Copy your **Project URL** and **Service Role Key / Anon Key** into [`backend/.env`](file:///d:/vicorx/adiii/backend/.env):
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-service-role-or-anon-key
   ```
5. Restart the backend server. It will immediately connect to your live Supabase database!

---

## 🧪 Interactive Live Role Switcher

When running the application, use the top banner to switch between the 3 roles at any time with one click:
- 🎓 **Student (`Alex Rivera`)**: Submit a new report with photos, view status timeline, and submit satisfaction feedback on resolved issues.
- 🔧 **Staff (`Marcus Vance`)**: View assigned queue, claim unassigned tasks, and update tickets to *In Progress* or *Resolved* with proof photos.
- 🛡️ **Admin (`Dr. Evelyn Hayes`)**: Assign staff, view staff workload, change user roles in the directory, and examine campus sustainability metrics.
