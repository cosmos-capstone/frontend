import React from 'react';
import Select from 'react-select';
import { useState, useEffect, ChangeEvent } from 'react';
import Dashboard from '../components/Dashboard';
import OptionSelector from '../components/OptionBoard';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { Transaction } from '../types/transaction';
import { StockListElement } from '../types/stockListElement';
import { fetchTransactions } from '../utils/api';
import { fetchStockData } from '../utils/api';
import { handleAssetNameChange, handleInputChange } from '../utils/dataRegistration';

export default function Home() {
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
  const [modifiedTransactions, setModifiedTransactions] = useState<Transaction[]>();
  const [koreanStocks, setKoreanStocks] = useState<StockListElement[]>([]);
  const [americanStocks, setAmericanStocks] = useState<StockListElement[]>([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);

  useEffect(() => {
    fetchTransactions(setExistingTransactions);
    fetchTransactions(setModifiedTransactions);
    fetchStockData("korean_stocks", setKoreanStocks);
    fetchStockData("american_stocks", setAmericanStocks);
  }, []);

  useEffect(() => {
    setCurrentEditIndex(2);
  }, []);

  return (
    <div className="flex flex-col space-y-8 bg-gray-100">
      <Dashboard />
      <div className="flex flex-row p-6 m-8 bg-white rounded-2xl border border-gray-200">
        <CustomFlowChart transactions={existingTransactions} />
        <OptionSelector />
      </div>
      <div className="flex flex-row p-6 m-8 bg-white rounded-2xl border border-gray-200">
        {currentEditIndex >= 0 && modifiedTransactions && modifiedTransactions[currentEditIndex] && (
          <EditTransactionRow
            transaction={modifiedTransactions[currentEditIndex]}
            index={currentEditIndex}
            handleInputChange={handleInputChange}
            handleAssetNameChange={handleAssetNameChange}
            koreanStocks={koreanStocks}
            americanStocks={americanStocks}
            setModifiedTransactions={setModifiedTransactions}
          />
        )}
      </div>
      <div className="flex flex-row p-6 m-8 bg-white rounded-2xl border border-gray-200">
        {currentEditIndex >= 0 && modifiedTransactions && (
          <CustomFlowChart transactions={modifiedTransactions} />
        )}
      </div>
    </div>
  );
}

const EditTransactionRow = ({
  transaction,
  index,
  handleInputChange,
  handleAssetNameChange,
  koreanStocks,
  americanStocks,
  setModifiedTransactions,
}: {
  transaction: Transaction;
  index: number;
  handleInputChange: (index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, setNewTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>) => void;
  handleAssetNameChange: (index: number, selectedOption: StockListElement | null, setNewTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>) => void;
  koreanStocks: StockListElement[];
  americanStocks: StockListElement[];
  setModifiedTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}) => (
  <table className="w-full">
    <tbody>
      <tr key={index} className="text-gray-600">
        <td className="py-2">
          <select
            name="transaction_type"
            value={transaction.transaction_type}
            onChange={(e) => handleInputChange(index, e, setModifiedTransactions)}
            className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </td>
        <td className="py-2">
          <select
            name="asset_category"
            value={transaction.asset_category}
            onChange={(e) => handleInputChange(index, e, setModifiedTransactions)}
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
        <td className="py-2">
          {(transaction.asset_category !== "korean_stock" && transaction.asset_category !== "american_stock") && (
            <input
              type="text"
              name="asset_name"
              value={transaction.asset_name || ""}
              onChange={(e) => handleInputChange(index, e, setModifiedTransactions)}
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
              onChange={(selectedOption) => handleAssetNameChange(index, selectedOption, setModifiedTransactions)}
              className="w-full"
            />
          )}
          {transaction.asset_category === "american_stock" && (
            <Select
              options={americanStocks}
              onChange={(selectedOption) => handleAssetNameChange(index, selectedOption, setModifiedTransactions)}
              className="w-full"
            />
          )}
        </td>
        <td className="py-2">
          <input
            type="number"
            name="quantity"
            value={transaction.quantity}
            onChange={(e) => handleInputChange(index, e, setModifiedTransactions)}
            className={`w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"
              ? "bg-gray-200 opacity-60 cursor-not-allowed"
              : ""
              }`}
            disabled={transaction.transaction_type === "deposit" || transaction.transaction_type === "withdrawal"}
            required
          />
        </td>
        <td className="py-2">
          <input
            type="number"
            name="transaction_amount"
            value={transaction.transaction_amount}
            onChange={(e) => handleInputChange(index, e, setModifiedTransactions)}
            className="w-full px-2 py-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </td>
      </tr>
    </tbody>
  </table>
);