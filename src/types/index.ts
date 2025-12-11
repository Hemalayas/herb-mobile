// Session Types
export type ConsumptionMethod = 'joint' | 'pen' | 'bong' | 'edible' | 'dab';
export type Mood =
  | 'relaxed'
  | 'energized'
  | 'creative'
  | 'focused'
  | 'social'
  | 'sleepy'
  | 'euphoric'
  | 'calm';

// 💰 Currency types
export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP';

export interface Session {
  id: string;
  timestamp: number;
  method: ConsumptionMethod;
  strain?: string;
  amount?: number; // in grams
  cost?: number;   // in base currency units
  social?: boolean;
  notes?: string;
  mood?: Mood;
}

// T-Break Types
export interface TBreak {
  id: string;
  startDate: number;
  goalDays: number;
  completed: boolean;
  endDate?: number;
  hadSlipUp?: boolean;
  slipUpDate?: number;
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
  timesEarned?: number;
}

// User Settings Types
export interface UserSettings {
  dailyLimit?: number;
  weeklyLimit?: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';

  // 💰 New fields
  currency?: CurrencyCode;        // default: 'USD'
  averageSessionCost?: number;    // user’s typical spend per session
}
