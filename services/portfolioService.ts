import { PortfolioHolding, Stock, ScreenerFilter } from '../types';

const STORAGE_KEY_PORTFOLIO = 'fbanks_portfolio_holdings_v3';

// Default Mock Data
const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', assetType: 'Stock', shares: 10, purchasePrice: 150, currentPrice: 175, gain: 250, gainPercent: 16.67 },
  { id: '2', ticker: 'MSFT', name: 'Microsoft', assetType: 'Stock', shares: 5, purchasePrice: 280, currentPrice: 330, gain: 250, gainPercent: 17.8 },
  { id: '3', ticker: 'VOO', name: 'Vanguard S&P 500', assetType: 'ETF', shares: 5, purchasePrice: 380, currentPrice: 410, gain: 150, gainPercent: 7.89 },
];

const MOCK_STOCKS: Stock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 175, pe: 28, peg: 2.1, divYield: 0.5, roe: 145, marketCap: 2800, debtEquity: 1.8, sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 330, pe: 32, peg: 2.4, divYield: 0.8, roe: 40, marketCap: 2500, debtEquity: 0.5, sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 135, pe: 25, peg: 1.5, divYield: 0, roe: 25, marketCap: 1700, debtEquity: 0.1, sector: 'Technology' },
];

// Helper to simulate delay but use local storage
export const getHoldings = async (enableMock: boolean = true): Promise<PortfolioHolding[]> => {
  return new Promise(resolve => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
        if (stored) {
            resolve(JSON.parse(stored));
        } else {
            // Only return default holdings if mock is enabled
            resolve(enableMock ? DEFAULT_HOLDINGS : []);
        }
    } catch (e) {
        resolve(enableMock ? DEFAULT_HOLDINGS : []);
    }
  });
};

export const saveHolding = async (holding: PortfolioHolding): Promise<PortfolioHolding[]> => {
    // When saving, we assume mock might be off, but we want to append to existing storage
    // We pass true here just to get whatever is currently considered "the list" 
    // effectively, if user adds a holding, they have started their own list
    const currentStr = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
    let current: PortfolioHolding[] = [];
    if (currentStr) {
        current = JSON.parse(currentStr);
    } else {
        // If nothing in storage, start fresh (don't append to mock data if user is adding their own)
        current = []; 
    }
    
    const updated = [...current, holding];
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(updated));
    return updated;
};

export const removeHolding = async (id: string): Promise<PortfolioHolding[]> => {
    const currentStr = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
    let current: PortfolioHolding[] = [];
    
    if (currentStr) {
        current = JSON.parse(currentStr);
    } else {
        // If deleting from default mock data, we first need to instantiate it in storage minus the deleted item
        // But usually, we only delete if we have data. 
        // If user tries to delete a mock item, we should probably start a local list without it.
        current = DEFAULT_HOLDINGS; 
    }

    const updated = current.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(updated));
    return updated;
};

export const runScreener = async (filters: ScreenerFilter): Promise<Stock[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = MOCK_STOCKS.filter(stock => {
        if (filters.marketCapMin && stock.marketCap < filters.marketCapMin) return false;
        if (filters.peMax && stock.pe > filters.peMax) return false;
        return true;
      });
      resolve(results);
    }, 500);
  });
};

export const getPresets = () => {
  return {
    graham: { marketCapMin: 10, peMax: 15, debtEquityMax: 0.5, divYieldMin: 1.0 },
    buffett: { marketCapMin: 50, roeMin: 15, debtEquityMax: 0.5 },
    lynchStalwarts: { pegMax: 1.5, divYieldMin: 1.5, marketCapMin: 10 },
    lynchGrowth: { pegMax: 1.0, marketCapMin: 0.5, marketCapMax: 10 }
  };
};