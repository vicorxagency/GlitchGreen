// Verified Seed Data for GLITCHXGREEN Campus Environmental Issue Tracking System
// Connected to Supabase Auth & Real Database

export const initialCategories = [
  {
    id: 'waste',
    name: 'Waste Management',
    description: 'Overflowing dustbins, unsegregated litter, and recyclable collection delays across student quads',
    icon: 'Trash2'
  },
  {
    id: 'water_leakage',
    name: 'Water Leakage',
    description: 'Dripping washroom taps, pipeline fractures, sprinkler overflows, and preventable water wastage',
    icon: 'Droplets'
  },
  {
    id: 'electricity',
    name: 'Electricity Wastage',
    description: 'High-power stadium lights or classroom ACs left running in empty campus halls during daytime',
    icon: 'Zap'
  },
  {
    id: 'sanitation',
    name: 'Sanitation and Cleanliness',
    description: 'Restroom hygiene maintenance, stagnant water pools, and sanitation concerns affecting health',
    icon: 'Sparkles'
  },
  {
    id: 'other',
    name: 'Other Campus Issues',
    description: 'Broken benches, damaged garden green belts, pathway hazards',
    icon: 'AlertTriangle'
  }
];

// Official Credentials for Graphic Era Roles (synced with Supabase Auth)
export const initialUsers = [
  {
    id: 'ca54d1c2-02a3-4233-92b6-7a43a8364ba1',
    email: 'student@graphicera.ac.in',
    full_name: 'Alex Rivera',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString()
  },
  {
    id: '4150a9ae-d9c0-4848-8168-f86b99749a20',
    email: 'staff@graphicera.ac.in',
    full_name: 'Marcus Vance',
    role: 'staff',
    department: 'Campus Facilities & Sanitation',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43211',
    created_at: new Date().toISOString()
  },
  {
    id: '637117f6-c84f-415b-b3ba-96a08b8847ba',
    email: 'admin@graphicera.ac.in',
    full_name: 'Dr. Evelyn Hayes',
    role: 'admin',
    department: 'Office of Campus Sustainability',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43212',
    created_at: new Date().toISOString()
  }
];

// All dummy reports removed as requested - Clean real-world operational state
export const initialReports = [];
export const initialFeedback = [];
export const initialStatusLogs = [];
