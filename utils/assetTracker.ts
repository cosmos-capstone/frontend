// utils/assetTracker.ts
export function trackAssets(transactions: Transaction[]): AssetHistory[] {
  let currentState: AssetState = {
    cash: 0,
    holdings: {}
  };
  
  const assetHistory: AssetHistory[] = [];

  for (const transaction of transactions) {
    // 현재 상태를 깊은 복사하여 이전 상태로 저장
    const previousState = JSON.parse(JSON.stringify(currentState));

    // 거래 처리 및 currentState 업데이트
    if (transaction.transaction_type === 'deposit') {
      currentState.cash += parseFloat(transaction.transaction_amount);
    } 
    else if (transaction.transaction_type === 'buy') {
      // 매수 거래의 경우, previousState에서는 해당 자산이 없어야 함
      if (transaction.asset_symbol && previousState.holdings[transaction.asset_symbol]) {
        delete previousState.holdings[transaction.asset_symbol];
      }
      
      currentState.cash -= parseFloat(transaction.transaction_amount);
      
      if (!currentState.holdings[transaction.asset_symbol!]) {
        currentState.holdings[transaction.asset_symbol!] = 0;
      }
      currentState.holdings[transaction.asset_symbol!] += transaction.quantity;
    }
    else if (transaction.transaction_type === 'sell') {
      currentState.cash += parseFloat(transaction.transaction_amount);
      currentState.holdings[transaction.asset_symbol!] -= transaction.quantity;
      
      if (currentState.holdings[transaction.asset_symbol!] === 0) {
        delete currentState.holdings[transaction.asset_symbol!];
      }
    }

    assetHistory.push({
      date: transaction.transaction_date,
      state: JSON.parse(JSON.stringify(currentState)),
      previousState: previousState
    });
  }

  return assetHistory;
}