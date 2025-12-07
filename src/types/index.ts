// Session Types
export type ConsumptionMethod = 'joint' | 'pen' | 'bong' | 'edible' | 'dab';

export interface Session {
  id: string;
  timestamp: number;
  method: ConsumptionMethod;
  strain?: string;
  amount?: number; // in grams
  cost?: number; // in dollars
  social?: boolean; // true = with friends, false/undefined = solo
  notes?: string;
}

// T-Break Types
export interface TBreak {
  id: string;
  startDate: number;
  goalDays: number;
  completed: boolean;
  endDate?: number;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  requirement: number;
  unlockedAt?: number;
  timesEarned?: number; // How many times this badge has been earned
}

// User Settings Types
export interface UserSettings {
  dailyLimit?: number; // Max sessions per day
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}