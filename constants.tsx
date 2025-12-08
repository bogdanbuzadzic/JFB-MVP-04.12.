
import React from 'react';
import { AssetAllocation, BudgetCategory, CalendarDay } from './types';

// Calendar Data Generation (Mocking Nov 2025 based on screenshot layout)
export const CALENDAR_DAYS: CalendarDay[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const isPast = day < 14;
  const isToday = day === 14;
  
  let transactions: any[] = [];
  let dailyTotal = 0;

  // Mock specific days from screenshot
  if (day === 2) dailyTotal = -118;
  if (day === 3) dailyTotal = -77;
  if (day === 5) dailyTotal = -69;
  if (day === 7) dailyTotal = -77;
  if (day === 8) dailyTotal = -27;
  if (day === 11) dailyTotal = -83;
  if (day === 12) dailyTotal = -91;
  if (day === 13) dailyTotal = -84;

  // Icons
  if (day === 15) transactions.push({ id: 't1', emoji: '📺', isUpcoming: true, color: '#F59E0B', amount: 14.99 }); // Netflix/TV
  if (day === 18) transactions.push({ id: 't2', emoji: '🍎', isUpcoming: true, color: '#EF4444', amount: 2.99 }); // Groceries
  if (day === 20) transactions.push({ id: 't3', emoji: '💬', isUpcoming: true, color: '#60A5FA' }); // Msg
  if (day === 28) transactions.push({ id: 't4', emoji: '🏠', isUpcoming: true, color: '#F59E0B', amount: 850 }); // Rent
  if (day === 29) transactions.push({ id: 't5', emoji: '🎵', isUpcoming: true, color: '#3B82F6', amount: 9.99 }); // Music

  return {
    day,
    isCurrentMonth: true,
    transactions,
    dailyTotal: dailyTotal !== 0 ? dailyTotal : undefined,
    isToday,
    isPast,
  };
});

export const ASSET_ALLOCATION: AssetAllocation[] = [
  { name: 'U.S. stocks', currentPercent: 40.2, modelPercent: 56, color: '#60A5FA' },
  { name: 'Intl. stocks', currentPercent: 14.2, modelPercent: 24, color: '#FCD34D' },
  { name: 'Crypto', currentPercent: 25, modelPercent: 31, color: '#D97706' },
  { name: 'Cash', currentPercent: 37.6, modelPercent: 18.3, color: '#5EEAD4' }
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: '1',
    name: 'Drinks & dining',
    spent: 360,
    budget: 600,
    color: '#F59E0B', 
    merchants: [
      { name: 'Starbucks', amount: 15.60, logo: '☕' },
      { name: "McDonald's", amount: 30.20, logo: '🍔' }
    ]
  },
  {
    id: '2',
    name: 'Travel & vacation',
    spent: 240,
    budget: 500,
    color: '#2DD4BF', 
  },
  {
    id: '3',
    name: 'Auto & transport',
    spent: 298,
    budget: 600,
    color: '#F97316', 
  },
  {
    id: '4',
    name: 'Childcare & education',
    spent: 298,
    budget: 600,
    color: '#7DD3FC', 
  }
];

// Mock Data for Line Chart (Portfolio vs S&P 500)
// Simulating a 1M view where Portfolio dips then recovers, while S&P is steadier
export const PORTFOLIO_COMPARISON_DATA = Array.from({ length: 40 }, (_, i) => {
  const t = i / 40; 
  // S&P 500: Slow steady growth with some noise
  const sp500 = 2 + (t * 3) + Math.sin(t * 10) * 0.2;
  
  // Portfolio: Volatile, drops below S&P then sharp recovery at end (like image)
  let portfolio = 2 + (t * 2.5) + Math.sin(t * 15) * 0.8;
  
  // Sharp tick up at the very end
  if (i > 35) {
      portfolio += (i - 35) * 0.5;
  }

  return {
      name: i,
      portfolio: Math.max(0, portfolio),
      sp500: Math.max(0, sp500)
  };
});
