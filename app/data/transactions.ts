// data/transactions.ts

export interface Transaction {
  id: number;
  transaction_date: string;
  transaction_type: 'deposit' | 'buy' | 'sell';
  asset_category: string | null;
  asset_symbol: string | null;
  asset_name: string | null;
  quantity: number;
  transaction_amount: string;
}

// 데이터 조회를 위한 유틸리티 함수들
export const getTransactionById = (data: Transaction[], id: number): Transaction | undefined => {
  return data.find(transaction => transaction.id === id);
};

export const getTransactionsByType = (data: Transaction[], type: 'deposit' | 'buy' | 'sell'): Transaction[] => {
  return data.filter(transaction => transaction.transaction_type === type);
};

export const getTransactionsBySymbol = (data: Transaction[], symbol: string): Transaction[] => {
  return data.filter(transaction => transaction.asset_symbol === symbol);
};

export const getTransactionsByDateRange = (data: Transaction[], startDate: Date, endDate: Date): Transaction[] => {
  return data.filter(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// 집계 함수들
export const getTotalDeposits = (data: Transaction[]): number => {
  return data
    .filter(t => t.transaction_type === 'deposit')
    .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
};

export const getTotalInvestment = (data: Transaction[]): number => {
  return data
    .filter(t => t.transaction_type === 'buy')
    .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
};

export const getTotalSales = (data: Transaction[]): number => {
  return data
    .filter(t => t.transaction_type === 'sell')
    .reduce((sum, t) => sum + parseFloat(t.transaction_amount), 0);
};

// 거래 통계 함수
export const getTransactionStats = (data: Transaction[]) => {
  const totalTransactions = data.length;
  const buyTransactions = data.filter(t => t.transaction_type === 'buy').length;
  const sellTransactions = data.filter(t => t.transaction_type === 'sell').length;
  const depositTransactions = data.filter(t => t.transaction_type === 'deposit').length;

  return {
    totalTransactions,
    buyTransactions,
    sellTransactions,
    depositTransactions,
    totalDeposits: getTotalDeposits(data),
    totalInvestment: getTotalInvestment(data),
    totalSales: getTotalSales(data),
  };
};

// 자산별 거래 현황
export const getAssetTransactionSummary = (data: Transaction[]) => {
  const summary: {
    [symbol: string]: {
      buys: number,
      sells: number,
      totalQuantity: number,
      totalInvested: number,
      totalSold: number
    }
  } = {};

  data.forEach(t => {
    if (t.asset_symbol) {
      if (!summary[t.asset_symbol]) {
        summary[t.asset_symbol] = {
          buys: 0,
          sells: 0,
          totalQuantity: 0,
          totalInvested: 0,
          totalSold: 0
        };
      }

      if (t.transaction_type === 'buy') {
        summary[t.asset_symbol].buys++;
        summary[t.asset_symbol].totalQuantity += t.quantity;
        summary[t.asset_symbol].totalInvested += parseFloat(t.transaction_amount);
      } else if (t.transaction_type === 'sell') {
        summary[t.asset_symbol].sells++;
        summary[t.asset_symbol].totalQuantity -= t.quantity;
        summary[t.asset_symbol].totalSold += parseFloat(t.transaction_amount);
      }
    }
  });

  return summary;
};