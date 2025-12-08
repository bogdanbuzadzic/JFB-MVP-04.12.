import { ClaritySurveyData, ClarityScore } from '../types';

export const fetchUserData = async () => {
  // Simulating an API call
  return new Promise<{ name: string; initial: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Alex",
        initial: "A"
      });
    }, 600);
  });
};

export const calculateClarityScore = (data: ClaritySurveyData): ClarityScore => {
  let spendingPoints = 0;
  let savingPoints = 0;
  let planningPoints = 0;

  const { income, expenses, debts, monthlySavings, cash, investments, hasPension, insurancePolicies } = data.numbers;
  const { billsOnTime } = data.financialHealth;

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const totalDebtPayments = debts.creditCards + debts.loans + debts.other;
  const totalCash = cash.bank + cash.savings;

  // --- SPENDING (max 35) ---
  // Avoid division by zero
  const safeIncome = income || 1; 
  const expenseRatio = (totalExpenses + totalDebtPayments) / safeIncome;
  
  if (expenseRatio <= 0.50) spendingPoints += 15;
  else if (expenseRatio <= 0.70) spendingPoints += 8;

  if (billsOnTime === 'always') spendingPoints += 15;
  else if (billsOnTime === 'sometimes') spendingPoints += 8;

  if (totalDebtPayments / safeIncome <= 0.20) spendingPoints += 5;

  // --- SAVING (max 35) ---
  const savingsRatio = monthlySavings / safeIncome;
  
  if (savingsRatio >= 0.20) savingPoints += 15;
  else if (savingsRatio >= 0.10) savingPoints += 8;

  const monthlyBurn = totalExpenses + totalDebtPayments || 1;
  const emergencyMonths = totalCash / monthlyBurn;

  if (emergencyMonths >= 6) savingPoints += 15;
  else if (emergencyMonths >= 3) savingPoints += 12;
  else if (emergencyMonths >= 1) savingPoints += 6;

  // Bonus for decent savings ratio
  if (savingsRatio >= 0.15) savingPoints += 5;

  // --- PLANNING (max 30) ---
  if (data.financialHealth.goals.length >= 3) planningPoints += 10;
  if (hasPension) planningPoints += 10;
  if (investments > 0) planningPoints += 5;
  if (insurancePolicies.length >= 3) planningPoints += 5;

  // Normalize totals to max 100 just in case logic floats above
  const total = Math.min(100, spendingPoints + savingPoints + planningPoints);

  // Status helpers
  const getStatus = (points: number, max: number) => {
    const p = points / max;
    if (p >= 0.8) return 'Excellent';
    if (p >= 0.6) return 'Good';
    if (p >= 0.4) return 'Fair';
    return 'Poor';
  };

  // 50-30-20 Estimation (Simplified for demo as we don't have Wants vs Needs granularity in categories perfectly, assuming categories map roughly)
  // We'll treat Savings as Savings.
  // We'll treat most expenses as Needs for this estimation, and assume a fixed portion is Wants or use the calculated ratio.
  // For precise 50/30/20 we need to tag expenses. Let's approximate.
  // Needs: Rent, Mortgage, Utilities, Council Tax, Insurance, Groceries, Child care, Car/Fuel, Public Transport, Loans
  // Wants: Media & Ent, Other
  
  const needsCategories = ['Rent', 'Mortgage', 'Utilities', 'Council Tax', 'Car / Fuel', 'Public transport', 'Insurance & Medical', 'Groceries', 'Child care'];
  const wantsCategories = ['Media & Ent.', 'Other'];
  
  let needsTotal = totalDebtPayments; // Debt is usually a need (obligation)
  let wantsTotal = 0;

  Object.entries(expenses).forEach(([cat, amount]) => {
     if (needsCategories.includes(cat)) needsTotal += amount;
     else wantsTotal += amount;
  });

  const needsPercent = Math.round((needsTotal / safeIncome) * 100);
  const wantsPercent = Math.round((wantsTotal / safeIncome) * 100);
  const savingsPercent = Math.round((monthlySavings / safeIncome) * 100);

  return {
    total,
    spendingPoints,
    savingPoints,
    planningPoints,
    spendingStatus: getStatus(spendingPoints, 35),
    savingStatus: getStatus(savingPoints, 35),
    planningStatus: getStatus(planningPoints, 30),
    breakdown: {
      needsPercent: Math.min(100, needsPercent),
      wantsPercent: Math.min(100, wantsPercent),
      savingsPercent: Math.min(100, savingsPercent)
    }
  };
};
