import React from 'react';
import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import OptionSelector from '../components/OptionBoard';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { Transaction } from '../types/transaction';
import { TransactionResponseItem } from '../types/transactionResponseItem';
import {
  // getTransactionsByType,  // unused variable error
  // getTransactionStats,  // unused variable error
  // getAssetTransactionSummary  // unused variable error
} from '../data/transactions';

export default function Home() {
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/test");
    const data = await res.json() as { data: TransactionResponseItem[] };
    const sortedData = data.data.map((item: TransactionResponseItem) => ({
      ...item,
      transaction_date: new Date(item.transaction_date)
    })).sort((a: Transaction, b: Transaction) => a.transaction_date.getTime() - b.transaction_date.getTime());
    setExistingTransactions(sortedData);
  }

  return (
    <>
      <Dashboard />
      <div className="flex flex-row p-5 overflow-y-auto m-8 bg-gradient-to-br from-gray-100 to-white p-10 rounded-3xl shadow-2xl">
        {/* <SankeyChartWrapper /> */}
        <CustomFlowChart transactions={existingTransactions} />
        <OptionSelector />
      </div>
    </>
  );
}