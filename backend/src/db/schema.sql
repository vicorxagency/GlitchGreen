-- ====================================================================
-- Campus Environmental Issue Tracking System (EcoTrack)
-- Supabase PostgreSQL Schema
-- ====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
    department TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ISSUE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY, -- e.g., ECO-2024-001
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES public.categories(id),
    location TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN ('Reported', 'Assigned', 'In Progress', 'Resolved')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolution_image_url TEXT,
    estimated_hours NUMERIC,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REPORT STATUS AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.report_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id TEXT NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENT FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id TEXT UNIQUE NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_properly_solved TEXT NOT NULL CHECK (is_properly_solved IN ('yes', 'partially', 'no')),
    satisfaction_rating INTEGER NOT NULL CHECK (satisfaction_rating BETWEEN 1 AND 5),
    time_taken_rating TEXT NOT NULL CHECK (time_taken_rating IN ('faster_than_expected', 'acceptable', 'too_slow')),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries and filtering
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_reported_by ON public.reports(reported_by);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON public.reports(assigned_to);
CREATE INDEX IF NOT EXISTS idx_status_logs_report_id ON public.report_status_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_feedback_report_id ON public.feedback(report_id);

-- ====================================================================
-- SEED INITIAL CATEGORIES
-- ====================================================================
INSERT INTO public.categories (id, name, description, icon) VALUES
    ('waste', 'Waste & Littering', 'Overflowing dustbins, scattered trash, uncollected recyclable bins', 'Trash2'),
    ('water_leakage', 'Water Leakage', 'Dripping taps, broken pipelines, washroom leaks, sprinkler overflows', 'Droplets'),
    ('electricity', 'Electricity Wastage', 'Lights or AC left running in empty rooms, faulty wiring, exposed fixtures', 'Zap'),
    ('sanitation', 'Sanitation & Hygiene', 'Dirty restrooms, blocked drainage, pest infestations, unhygienic cafeteria spots', 'Sparkles'),
    ('other', 'Other Campus Issue', 'Broken benches, damaged garden plants, pavement hazards, noise pollution', 'AlertTriangle')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (Optional policies can be set as desired)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow public read for prototyping & standard application service keys
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public reports are viewable by everyone" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public feedback is viewable by everyone" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Public status logs are viewable by everyone" ON public.report_status_logs FOR SELECT USING (true);

-- Allow authenticated or key holders to insert/update
CREATE POLICY "Allow insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update reports" ON public.reports FOR UPDATE USING (true);
CREATE POLICY "Allow insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert logs" ON public.report_status_logs FOR INSERT WITH CHECK (true);
