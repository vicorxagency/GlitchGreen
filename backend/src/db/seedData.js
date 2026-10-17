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

// All dummy users removed as requested - Clean real-world operational state
export const initialUsers = [];

// All dummy reports removed as requested - Clean real-world operational state
export const initialReports = [];
export const initialFeedback = [];
export const initialStatusLogs = [];
