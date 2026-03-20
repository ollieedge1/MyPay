export interface UserProfile {
  salary: number;
  currentPension: number;
  employerPension: number;
  minTakeHome: number;
  goals: string[];
  expenses: {
    rent: number;
    bills: number;
    food: number;
    other: number;
  };
}

export interface TaxResult {
  grossIncome: number;
  pensionContribution: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  takeHome: number;
  pensionTotal: number;
}

export type AppStep = 'landing' | 'profile' | 'goals' | 'lifestyle' | 'results' | 'premium' | 'settings';
