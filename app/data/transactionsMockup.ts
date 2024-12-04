// data/transactions.ts

import { Transaction } from "../types/transaction";
// export interface Transaction {
//     id: number;
//     transaction_date: string;
//     transaction_type: 'deposit' | 'buy' | 'sell';
//     asset_category: string | null;
//     asset_symbol: string | null;
//     asset_name: string | null;
//     quantity: number;
//     transaction_amount: string;
//   }

//   export const TRANSACTION_DATA: Transaction[] = [
//     {
//       "id": 1,
//       "transaction_date": "2023-01-01T09:30:00Z",
//       "transaction_type": "deposit",
//       "asset_category": null,
//       "asset_symbol": null,
//       "asset_name": null,
//       "quantity": 0,
//       "transaction_amount": "7000000.00"
//     },
//     {
//       "id": 2,
//       "transaction_date": "2023-01-15T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "SPY",
//       "asset_name": "SPDR S&P500 ETF 트러스트",
//       "quantity": 5,
//       "transaction_amount": "545065.00"
//     },
//     {
//       "id": 3,
//       "transaction_date": "2023-01-15T11:30:00Z", 
//       "transaction_type": "sell",
//       "asset_category": "american_stock",
//       "asset_symbol": "SPY",
//       "asset_name": "SPDR S&P500 ETF 트러스트",
//       "quantity": 2,
//       "transaction_amount": "547000.00"
//     },
//     {
//       "id": 4,
//       "transaction_date": "2023-01-15T15:30:00Z", 
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "SPY",
//       "asset_name": "SPDR S&P500 ETF 트러스트",
//       "quantity": 3,
//       "transaction_amount": "548000.00"
//     },
//     {
//       "id": 5,
//       "transaction_date": "2023-02-01T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock", 
//       "asset_symbol": "AAPL",
//       "asset_name": "애플",
//       "quantity": 8,
//       "transaction_amount": "593889.00"
//     },
//     {
//       "id": 6,
//       "transaction_date": "2023-02-01T11:30:00Z",
//       "transaction_type": "sell",
//       "asset_category": "american_stock", 
//       "asset_symbol": "AAPL",
//       "asset_name": "애플",
//       "quantity": 3,
//       "transaction_amount": "595000.00"
//     },
//     {
//       "id": 7,
//       "transaction_date": "2023-02-01T15:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock", 
//       "asset_symbol": "AAPL",
//       "asset_name": "애플",
//       "quantity": 4,
//       "transaction_amount": "598000.00"
//     },
//     {
//       "id": 8,
//       "transaction_date": "2023-02-15T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "korean_stock",
//       "asset_symbol": "005930.KS",
//       "asset_name": "삼성전자",
//       "quantity": 100,
//       "transaction_amount": "501200.00"
//     },
//     {
//       "id": 9,
//       "transaction_date": "2023-02-15T11:30:00Z",
//       "transaction_type": "sell",
//       "asset_category": "korean_stock",
//       "asset_symbol": "005930.KS",
//       "asset_name": "삼성전자",
//       "quantity": 30,
//       "transaction_amount": "503400.00"
//     },
//     {
//       "id": 10,
//       "transaction_date": "2023-02-15T15:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "korean_stock",
//       "asset_symbol": "005930.KS",
//       "asset_name": "삼성전자",
//       "quantity": 50,
//       "transaction_amount": "505000.00"
//     },
//     {
//       "id": 11,
//       "transaction_date": "2023-03-01T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "MSFT",
//       "asset_name": "마이크로소프트",
//       "quantity": 6,
//       "transaction_amount": "315000.00"
//     },
//     {
//       "id": 12,
//       "transaction_date": "2023-03-01T11:30:00Z",
//       "transaction_type": "sell",
//       "asset_category": "american_stock",
//       "asset_symbol": "MSFT",
//       "asset_name": "마이크로소프트",
//       "quantity": 2,
//       "transaction_amount": "317000.00"
//     },
//     {
//       "id": 13,
//       "transaction_date": "2023-03-01T15:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "MSFT",
//       "asset_name": "마이크로소프트",
//       "quantity": 3,
//       "transaction_amount": "320000.00"
//     },
//     {
//       "id": 14,
//       "transaction_date": "2023-03-15T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "korean_stock",
//       "asset_symbol": "035720.KS",
//       "asset_name": "카카오",
//       "quantity": 40,
//       "transaction_amount": "456000.00"
//     },
//     {
//       "id": 15,
//       "transaction_date": "2023-03-15T11:30:00Z",
//       "transaction_type": "sell",
//       "asset_category": "korean_stock",
//       "asset_symbol": "035720.KS",
//       "asset_name": "카카오",
//       "quantity": 15,
//       "transaction_amount": "458000.00"
//     },
//     {
//       "id": 16,
//       "transaction_date": "2023-03-15T15:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "korean_stock",
//       "asset_symbol": "035720.KS",
//       "asset_name": "카카오",
//       "quantity": 20,
//       "transaction_amount": "460000.00"
//     },
//     {
//       "id": 17,
//       "transaction_date": "2023-04-01T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "NVDA",
//       "asset_name": "엔비디아",
//       "quantity": 4,
//       "transaction_amount": "892450.00"
//     },
//     {
//       "id": 18,
//       "transaction_date": "2023-04-01T11:30:00Z",
//       "transaction_type": "sell",
//       "asset_category": "american_stock",
//       "asset_symbol": "NVDA",
//       "asset_name": "엔비디아",
//       "quantity": 2,
//       "transaction_amount": "895000.00"
//     },
//     {
//       "id": 19,
//       "transaction_date": "2023-04-01T15:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "NVDA",
//       "asset_name": "엔비디아",
//       "quantity": 3,
//       "transaction_amount": "898000.00"
//     },
//     {
//       "id": 20,
//       "transaction_date": "2023-04-15T09:30:00Z",
//       "transaction_type": "buy",
//       "asset_category": "american_stock",
//       "asset_symbol": "GOOGL",
//       "asset_name": "알파벳",
//       "quantity": 5,
//       "transaction_amount": "456780.00"
//     }
// ];
export const TRANSACTION_DATA: Transaction[] = [
  {
    "id": 1,
    "transaction_date": "2023-01-01T09:30:00Z",
    "transaction_type": "deposit",
    "asset_category": null,
    "asset_symbol": null,
    "asset_name": null,
    "quantity": 0,
    "transaction_amount": "7000000.00"
  },
  {
    "id": 2,
    "transaction_date": "2023-01-12T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "SPY",
    "asset_name": "SPDR S&P500 ETF 트러스트",
    "quantity": 5,
    "transaction_amount": "545065.00"
  },
  {
    "id": 3,
    "transaction_date": "2023-01-18T11:30:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "asset_symbol": "SPY",
    "asset_name": "SPDR S&P500 ETF 트러스트",
    "quantity": 2,
    "transaction_amount": "547000.00"
  },
  {
    "id": 4,
    "transaction_date": "2023-01-19T15:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "SPY",
    "asset_name": "SPDR S&P500 ETF 트러스트",
    "quantity": 3,
    "transaction_amount": "548000.00"
  },
  {
    "id": 5,
    "transaction_date": "2023-02-01T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "AAPL",
    "asset_name": "애플",
    "quantity": 8,
    "transaction_amount": "593889.00"
  },
  {
    "id": 6,
    "transaction_date": "2023-02-02T11:30:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "asset_symbol": "AAPL",
    "asset_name": "애플",
    "quantity": 3,
    "transaction_amount": "593889.00"
  },
  {
    "id": 7,
    "transaction_date": "2023-02-03T15:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "AAPL",
    "asset_name": "애플",
    "quantity": 4,
    "transaction_amount": "598000.00"
  },
  {
    "id": 8,
    "transaction_date": "2023-02-15T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "asset_symbol": "005930.KS",
    "asset_name": "삼성전자",
    "quantity": 100,
    "transaction_amount": "501200.00"
  },
  {
    "id": 9,
    "transaction_date": "2023-02-16T11:30:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "asset_symbol": "005930.KS",
    "asset_name": "삼성전자",
    "quantity": 30,
    "transaction_amount": "503400.00"
  },
  {
    "id": 10,
    "transaction_date": "2023-02-21T15:30:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "asset_symbol": "005930.KS",
    "asset_name": "삼성전자",
    "quantity": 50,
    "transaction_amount": "505000.00"
  },
  {
    "id": 11,
    "transaction_date": "2023-03-01T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "MSFT",
    "asset_name": "마이크로소프트",
    "quantity": 6,
    "transaction_amount": "315000.00"
  },
  {
    "id": 12,
    "transaction_date": "2023-03-02T11:30:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "asset_symbol": "MSFT",
    "asset_name": "마이크로소프트",
    "quantity": 2,
    "transaction_amount": "317000.00"
  },
  {
    "id": 13,
    "transaction_date": "2023-03-06T15:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "MSFT",
    "asset_name": "마이크로소프트",
    "quantity": 3,
    "transaction_amount": "320000.00"
  },
  {
    "id": 14,
    "transaction_date": "2023-03-15T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "asset_symbol": "035720.KS",
    "asset_name": "카카오",
    "quantity": 40,
    "transaction_amount": "456000.00"
  },
  {
    "id": 15,
    "transaction_date": "2023-03-16T11:30:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "asset_symbol": "035720.KS",
    "asset_name": "카카오",
    "quantity": 15,
    "transaction_amount": "458000.00"
  },
  
 
].map((transaction): Transaction => ({
  ...transaction,
  transaction_date: new Date(transaction.transaction_date),
  transaction_type: transaction.transaction_type as 'deposit' | 'withdrawal' | 'buy' | 'sell',
  asset_category: transaction.asset_category as "korean_stock" | "american_stock" | "korean_bond" | "american_bond" | "fund" | "commodity" | "gold" | "deposit" | "savings" | "cash",
  transaction_amount: parseFloat(transaction.transaction_amount)
}));

export const TRANSACTION_DATA_1: Transaction[] = [
  {
    "id": 0,
    "transaction_date": "2023-01-01T09:30:00Z",
    "transaction_type": "deposit",
    "asset_category": null,
    "asset_symbol": null,
    "asset_name": null,
    "quantity": 0,
    "transaction_amount": "70000.00"
  },
  {
    "id": 1,
    "transaction_date": "2017-03-15T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "NVDA",
    "asset_name": "NVIDIA Corporation",
    "quantity": 5,
    "transaction_amount": "535.00"
  },
  {
    "id": 2,
    "transaction_date": "2018-09-20T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "NVDA",
    "asset_name": "NVIDIA Corporation",
    "quantity": 5,
    "transaction_amount": "1365.00"
  },
  {
    "id": 3,
    "transaction_date": "2022-05-10T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "NVDA",
    "asset_name": "NVIDIA Corporation",
    "quantity": 5,
    "transaction_amount": "855.00"
  },
  {
    "id": 4,
    "transaction_date": "2024-02-28T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "GOOGL",
    "asset_name": "알파벳",
    "quantity": 5,
    "transaction_amount": "275.00"
  },
  {
    "id": 5,
    "transaction_date": "2024-03-28T09:30:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "asset_symbol": "^GSPC",
    "asset_name": "S&P 500",
    "quantity": 0.1,
    "transaction_amount": "6800.00"
  }
].map((transaction): Transaction => ({
  ...transaction,
  transaction_date: new Date(transaction.transaction_date),
  transaction_type: transaction.transaction_type as 'deposit' | 'withdrawal' | 'buy' | 'sell',
  asset_category: transaction.asset_category as "korean_stock" | "american_stock" | "korean_bond" | "american_bond" | "fund" | "commodity" | "gold" | "deposit" | "savings" | "cash",
  transaction_amount: parseFloat(transaction.transaction_amount)
}));


// 데이터 조회를 위한 유틸리티 함수들
export const getTransactionById = (id: number): Transaction | undefined => {
  return TRANSACTION_DATA.find(transaction => transaction.id === id);
};

export const getTransactionsByType = (type: 'deposit' | 'buy' | 'sell'): Transaction[] => {
  return TRANSACTION_DATA.filter(transaction => transaction.transaction_type === type);
};

export const getTransactionsBySymbol = (symbol: string): Transaction[] => {
  return TRANSACTION_DATA.filter(transaction => transaction.asset_symbol === symbol);
};

export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  return TRANSACTION_DATA.filter(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// 집계 함수들
export const getTotalDeposits = (): number => {
  return TRANSACTION_DATA
    .filter(t => t.transaction_type === 'deposit')
    .reduce((sum, t) => sum + t.transaction_amount, 0);
};

export const getTotalInvestment = (): number => {
  return TRANSACTION_DATA
    .filter(t => t.transaction_type === 'buy')
    .reduce((sum, t) => sum + t.transaction_amount, 0);
};

export const getTotalSales = (): number => {
  return TRANSACTION_DATA
    .filter(t => t.transaction_type === 'sell')
    .reduce((sum, t) => sum + t.transaction_amount, 0);
};

// 거래 통계 함수
export const getTransactionStats = () => {
  const totalTransactions = TRANSACTION_DATA.length;
  const buyTransactions = TRANSACTION_DATA.filter(t => t.transaction_type === 'buy').length;
  const sellTransactions = TRANSACTION_DATA.filter(t => t.transaction_type === 'sell').length;
  const depositTransactions = TRANSACTION_DATA.filter(t => t.transaction_type === 'deposit').length;

  return {
    totalTransactions,
    buyTransactions,
    sellTransactions,
    depositTransactions,
    totalDeposits: getTotalDeposits(),
    totalInvestment: getTotalInvestment(),
    totalSales: getTotalSales(),
  };
};

// 자산별 거래 현황
export const getAssetTransactionSummary = () => {
  const summary: {
    [symbol: string]: {
      buys: number,
      sells: number,
      totalQuantity: number,
      totalInvested: number,
      totalSold: number
    }
  } = {};

  TRANSACTION_DATA.forEach(t => {
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
        summary[t.asset_symbol].totalInvested += t.transaction_amount;
      } else if (t.transaction_type === 'sell') {
        summary[t.asset_symbol].sells++;
        summary[t.asset_symbol].totalQuantity -= t.quantity;
        summary[t.asset_symbol].totalSold += t.transaction_amount;
      }
    }
  });

  return summary;
};