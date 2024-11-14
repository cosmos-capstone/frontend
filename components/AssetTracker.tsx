'use client';
import { useEffect, useState } from 'react';
import { Transaction, AssetHistory } from '../type/types';
import { trackAssets } from '../utils/assetTracker';

interface AssetTrackerProps {
  transactionData: Transaction[];
}

export default function AssetTracker({ transactionData }: AssetTrackerProps) {
  const [assetHistory, setAssetHistory] = useState<AssetHistory[]>([]);

  useEffect(() => {
    const history = trackAssets(transactionData);
    setAssetHistory(history);
  }, [transactionData]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">자산 추적</h2>
      <div className="space-y-4">
        {assetHistory.map((entry, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h3 className="font-semibold">
              거래 #{index + 1} ({new Date(entry.date).toLocaleDateString('ko-KR')})
            </h3>
            
            {/* 거래 전 상태 */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="border-r pr-4">
                <h4 className="font-medium">거래 전:</h4>
                <p className="text-lg">
                  현금: {entry.previousState?.cash.toLocaleString()}원
                </p>
                <div className="mt-2">
                  <h5 className="font-medium">보유 자산:</h5>
                  <ul className="list-disc pl-5">
                    {Object.entries(entry.previousState?.holdings || {}).map(([symbol, quantity]) => (
                      <li key={`prev-${symbol}`}>
                        {symbol}: {quantity}주
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 거래 후 상태 */}
              <div className="pl-4">
                <h4 className="font-medium">거래 후:</h4>
                <p className="text-lg">
                  현금: {entry.state.cash.toLocaleString()}원
                </p>
                <div className="mt-2">
                  <h5 className="font-medium">보유 자산:</h5>
                  <ul className="list-disc pl-5">
                    {Object.entries(entry.state.holdings).map(([symbol, quantity]) => (
                      <li key={`curr-${symbol}`}>
                        {symbol}: {quantity}주
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 거래 정보 */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium">거래 내역:</h4>
              {getTransactionInfo(transactionData.find(t => t.transaction_date === entry.date))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 거래 정보를 표시하는 헬퍼 함수
function getTransactionInfo(transaction?: Transaction) {
  if (!transaction) return null;

  switch (transaction.transaction_type) {
    case 'deposit':
      return (
        <p className="text-blue-600">
          입금: {parseFloat(transaction.transaction_amount).toLocaleString()}원
        </p>
      );
    case 'buy':
      return (
        <p className="text-green-600">
          매수: {transaction.asset_symbol} {transaction.quantity}주 
          ({parseFloat(transaction.transaction_amount).toLocaleString()}원)
        </p>
      );
    case 'sell':
      return (
        <p className="text-red-600">
          매도: {transaction.asset_symbol} {transaction.quantity}주 
          ({parseFloat(transaction.transaction_amount).toLocaleString()}원)
        </p>
      );
    default:
      return null;
  }
}