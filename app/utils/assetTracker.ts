import { AssetHistory, AssetState } from '../types/types';
import { Transaction } from '../types/transaction';

export function trackAssets(transactions: Transaction[]): AssetHistory[] {
  const currentState: AssetState = {
    cash: 0,
    holdings: {}
  };
  
  const assetHistory: AssetHistory[] = [];

  for (const transaction of transactions) {
    // 거래 전의 상태를 저장 (이전 거래 후의 상태)
    const previousState = {
      cash: currentState.cash,
      holdings: { ...currentState.holdings }  // 깊은 복사
    };

    // 현재 거래 처리
    if (transaction.transaction_type === 'deposit') {
      currentState.cash += transaction.transaction_amount;
    } 
    else if (transaction.transaction_type === 'buy') {
      currentState.cash -= transaction.transaction_amount;
      
      if (!currentState.holdings[transaction.asset_symbol!]) {
        currentState.holdings[transaction.asset_symbol!] = transaction.quantity;
      } else {
        currentState.holdings[transaction.asset_symbol!] += transaction.quantity;
      }
    }
    else if (transaction.transaction_type === 'sell') {
      currentState.cash += transaction.transaction_amount;
      currentState.holdings[transaction.asset_symbol!] -= transaction.quantity;
      
      if (currentState.holdings[transaction.asset_symbol!] === 0) {
        delete currentState.holdings[transaction.asset_symbol!];
      }
    }

    // 거래 기록 추가
    assetHistory.push({
      date: transaction.transaction_date.toISOString(),
      state: {
        cash: currentState.cash,
        holdings: { ...currentState.holdings }
      },
      previousState: previousState
    });
  }

  return assetHistory;
}