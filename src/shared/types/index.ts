// shared/types.ts

// -----------------------
// User Profile Types
// -----------------------
export interface UserProfile {
  id: string;
  createdAt: string;

  // Onboarding data
  occupation: string;
  employmentType: 'employee' | 'self-employed' | 'contractor' | 'both';
  incomeRange: string;

  // Profile details
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  // Employment
  employer?: string;
  annualIncome?: number;
  taxWithheld?: number;

  // Work situation
  hasHomeOffice: boolean;
  hasWorkVehicle: boolean;
  hasWorkTravel: boolean;

  // Family
  hasSpouse: boolean;
  numberOfDependents: number;

  // Preferences
  financialYearEnd: string;
}

// -----------------------
// Deduction Types
// -----------------------
export interface Deduction {
  id: string;
  category: DeductionCategory;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  notes?: string;
  claimPercentage: number; // e.g., 100 for fully claimable
}

export type DeductionCategory =
  | 'vehicle'
  | 'home-office'
  | 'travel'
  | 'education'
  | 'tools-equipment'
  | 'clothing-laundry'
  | 'phone-internet'
  | 'professional-fees'
  | 'insurance'
  | 'other';

// -----------------------
// App State
// -----------------------
export interface AppState {
  user: UserProfile | null;
  deductions: Deduction[];
  onboardingComplete: boolean;
  currentStep?: 'welcome' | 'occupation' | 'employment' | 'completed';
}
