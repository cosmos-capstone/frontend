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
            <p className="text-lg">
              현금: {entry.state.cash.toLocaleString()}원
            </p>
            <div className="mt-2">
              <h4 className="font-medium">보유 자산:</h4>
              <ul className="list-disc pl-5">
                {Object.entries(entry.state.holdings).map(([symbol, quantity]) => (
                  <li key={symbol}>
                    {symbol}: {quantity}주
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}