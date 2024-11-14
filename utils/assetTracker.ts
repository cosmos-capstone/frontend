// utils/assetTracker.ts
export function trackAssets(transactions: Transaction[]): AssetHistory[] {
  let currentState: AssetState = {
    cash: 0,
    holdings: {}
  };
  
  const assetHistory: AssetHistory[] = [];

  for (const transaction of transactions) {
    const previousState = { ...currentState };

    if (transaction.transaction_type === 'deposit') {
      currentState.cash += parseFloat(transaction.transaction_amount);
    } 
    else if (transaction.transaction_type === 'buy') {
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
      previousState: JSON.parse(JSON.stringify(previousState))
    });
  }

  return assetHistory;
}