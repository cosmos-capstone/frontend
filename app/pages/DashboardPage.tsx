import React from 'react';
import Select from 'react-select';
import { useState, useEffect, ChangeEvent } from 'react';
import Dashboard from '../components/Dashboard';
import OptionSelector from '../components/OptionBoard';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { Transaction } from '../types/transaction';
import { StockListElement } from '../types/stockListElement';
import { formatDateForInput } from '../utils/dateUtils';
import { fetchTransactions } from '../utils/api';
import { fetchStockData } from '../utils/api';
import {
  // getTransactionsByType,  // unused variable error
  // getTransactionStats,  // unused variable error
  // getAssetTransactionSummary  // unused variable error
} from '../data/transactions';

export default function Home() {
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
  const [modifiedTransactions, setModifiedTransactions] = useState<Transaction[]>();
  const [koreanStocks, setKoreanStocks] = useState<StockListElement[]>([]);
  const [americanStocks, setAmericanStocks] = useState<StockListElement[]>([]);

  useEffect(() => {
    fetchTransactions(setExistingTransactions);
    fetchTransactions(setModifiedTransactions);
    fetchStockData("korean_stocks", setKoreanStocks);
    fetchStockData("american_stocks", setAmericanStocks);
  }, []);

  return (
    <>
      <Dashboard />
      <div className="flex flex-row p-5 overflow-y-auto m-8 bg-gradient-to-br from-gray-100 to-white p-10 rounded-3xl shadow-2xl">
        {/* <SankeyChartWrapper /> */}
        <CustomFlowChart transactions={existingTransactions} />
        <OptionSelector />
      </div>
      {modifiedTransactions && modifiedTransactions[0] && (
        <EditTransactionRow
          transaction={modifiedTransactions[0]}
          index={0}
          handleInputChange={handleInputChange}
          handleAssetNameChange={handleAssetNameChange}
          koreanStocks={koreanStocks}
          americanStocks={americanStocks}
        />
      )}
      <CustomFlowChart transactions={modifiedTransactions} />
    </>
  );
}

const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
};

const handleAssetNameChange = (index: number, selectedOption: StockListElement | null) => {
};

interface EditTransactionRowProps {
  transaction: Transaction;
  index: number;
  handleInputChange: (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAssetNameChange: (index: number, selectedOption: StockListElement | null) => void;
  koreanStocks: StockListElement[];
  americanStocks: StockListElement[];
}

const EditTransactionRow = ({
  transaction,
  index,
  handleInputChange,
  handleAssetNameChange,
  koreanStocks,
  americanStocks
}: EditTransactionRowProps) => (
  <tr key={index} className="text-gray-600 bg-gray-50">
    <td className="border-b py-2">
      <input
        type="datetime-local"
        name="transaction_date"
        value={formatDateForInput(transaction.transaction_date)}
        onChange={(e) => handleInputChange(index, e)}
        className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </td>
    <td className="border-b py-2">
      <select
        name="transaction_type"
        value={transaction.transaction_type}
        onChange={(e) => handleInputChange(index, e)}
        className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
    </td>
    <td className="border-b py-2">
      <select
        name="asset_category"
        value={transaction.asset_category}
        onChange={(e) => handleInputChange(index, e)}
        className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
          ? "bg-gray-200 opacity-60 cursor-not-allowed"
          : ""
          }`}
        disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
        required
      >
        <option value="korean_stock">Korean Stock</option>
        <option value="american_stock">American Stock</option>
        <option value="korean_bond">Korean Bond</option>
        <option value="american_bond">American Bond</option>
        <option value="commodity">Commodity</option>
        <option value="gold">Gold</option>
        <option value="deposit">Deposit</option>
        <option value="savings">Savings Account</option>
      </select>
    </td>
    <td className="border-b py-2">
      {(transaction.asset_category !== "korean_stock" && transaction.asset_category !== "american_stock") && (
        <input
          type="text"
          name="asset_name"
          value={transaction.asset_name || ""}
          onChange={(e) => handleInputChange(index, e)}
          className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
            ? "bg-gray-200 opacity-60 cursor-not-allowed"
            : ""
            }`}
          disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
        />
      )}

      {transaction.asset_category === "korean_stock" && (
        <Select
          options={koreanStocks}
          onChange={(selectedOption) => handleAssetNameChange(index, selectedOption)}
          className="w-full"
        />
      )}
      {transaction.asset_category === "american_stock" && (
        <Select
          options={americanStocks}
          onChange={(selectedOption) => handleAssetNameChange(index, selectedOption)}
          className="w-full"
        />
      )}
    </td>
    <td className="border-b py-2">
      <input
        type="number"
        name="quantity"
        value={transaction.quantity}
        onChange={(e) => handleInputChange(index, e)}
        className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
          ? "bg-gray-200 opacity-60 cursor-not-allowed"
          : ""
          }`}
        disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
        required
      />
    </td>
    <td className="border-b py-2">
      <input
        type="number"
        name="transaction_amount"
        value={transaction.transaction_amount}
        onChange={(e) => handleInputChange(index, e)}
        className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </td>
  </tr>
);