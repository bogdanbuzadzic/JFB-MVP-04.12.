

export interface Transaction {
  id: string;
  emoji: string;
  amount?: number;
  color?: string; // Hex code
  merchant?: string;
  isUpcoming?: boolean;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  transactions: Transaction[];
  dailyTotal?: number;
  isToday?: boolean;
  isPast?: boolean;
}

export interface AssetAllocation {
  name: string;
  currentPercent: number;
  modelPercent: number;
  color: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  merchants?: {
    name: string;
    amount: number;
    logo?: string; // emoji or url
  }[];
}

export interface ClaritySurveyData {
  personal: {
    name: string;
    age: string;
    scope: 'yourself' | 'household' | '';
  };
  financialHealth: {
    billsOnTime: 'always' | 'sometimes' | 'rarely' | '';
    feeling: 'ok' | 'worried' | '';
    goals: string[];
  };
  numbers: {
    income: number;
    expenses: Record<string, number>;
    hasDebt: boolean | null;
    debts: {
      creditCards: number;
      loans: number;
      other: number;
    };
    monthlySavings: number;
    cash: {
      bank: number;
      savings: number;
    };
    hasPension: boolean | null;
    investments: number;
    insurancePolicies: string[];
  };
}

export interface ClarityScore {
  total: number;
  spendingPoints: number;
  savingPoints: number;
  planningPoints: number;
  spendingStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  savingStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  planningStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  breakdown: {
    needsPercent: number;
    wantsPercent: number;
    savingsPercent: number;
  }
}

export interface TetrisBlock {
  id: string;
  type: 'income' | 'expense' | 'savings' | 'investment';
  category: string;
  amount: number;
  percent?: number;
  color?: string;
  isAsset?: boolean; // True for Cash/Portfolio balances, False for Monthly Flows
}

export interface TetrisGoal {
  id: string;
  name: string;
  targetAmount: number;
  timeframeMonths: number;
  emoji?: string;
  color?: string;
  neededPerMonth?: number;
  deadline?: string; 
  category?: 'savings' | 'investment'; 
}

// --- Portfolio Builder Types ---

export interface PortfolioHolding {
  id: string;
  ticker: string;
  name?: string;
  assetType: 'Stock' | 'ETF' | 'Crypto' | 'Bond' | 'Cash';
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  gain?: number;
  gainPercent?: number;
  sector?: string;
  color?: string;
}

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  pe: number;
  peg: number;
  divYield: number;
  roe: number;
  marketCap: number; // Billions
  debtEquity: number;
  sector: string;
}

export interface ScreenerFilter {
  marketCapMin?: number;
  peMax?: number;
  pegMax?: number;
  divYieldMin?: number;
  roeMin?: number;
  debtEquityMax?: number;
}