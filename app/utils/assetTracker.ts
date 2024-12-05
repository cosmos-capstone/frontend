import { AssetHistory, AssetState } from '../types/types';
import { Transaction } from '../types/transaction';

import { fetchStockData, getStockPrice } from '../utils/api';

export let maxAssetValue = 10;
async function calculateMaxAssetValue(history: AssetHistory): Promise<number> {
  let maxValue = history.state.cash;
  for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
    const indiviualStockPrice = await getStockPrice(symbol, history.date);
    maxValue = maxValue + indiviualStockPrice * quantity;
  }

  return maxValue;
}
export async function trackAssets(transactions: Transaction[]): Promise<AssetHistory[]> {
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
      // console.log("lll Deposit add",currentState.cash );
      // console.log("lllCurrent cash type:", typeof currentState.cash);
      currentState.cash = Number(currentState.cash) + Number(transaction.transaction_amount);
      
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
      date: transaction.transaction_date,
      state: {
        cash: currentState.cash,
        holdings: { ...currentState.holdings }
      },
      previousState: previousState
    });
    maxAssetValue = await calculateMaxAssetValue({
      date: transaction.transaction_date,
      state: {
        cash: currentState.cash,
        holdings: { ...currentState.holdings }
      },
      previousState: previousState
    })
    
  }

  return assetHistory;
}