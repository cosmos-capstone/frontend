import { Transaction } from '../type/types';
import AssetTracker from '../components/AssetTracker';

import { 
  TRANSACTION_DATA, 
  getTransactionsByType, 
  getTransactionStats,
  getAssetTransactionSummary 
} from '../data/transactions';

import AssetFlowChart from '../components/AssetFlowChart';
import CustomFlowChart from '../components/CustomFlowChart';


// 예시 사용
const buyTransactions = getTransactionsByType('buy');
const stats = getTransactionStats();
const assetSummary = getAssetTransactionSummary();
export default function Home() {
  return (
    <main className="container mx-auto">
      <CustomFlowChart transactions={TRANSACTION_DATA} />
      <AssetFlowChart transactions={TRANSACTION_DATA} />
      
      <AssetTracker transactionData={TRANSACTION_DATA} />
    </main>
  );
}