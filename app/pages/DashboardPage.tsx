import React from 'react';
import Select from 'react-select';
import { useState, useEffect, ChangeEvent } from 'react';
import Dashboard from '../components/Dashboard';
import OptionSelector from '../components/OptionBoard';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { StockListElement } from '../types/stockListElement';

import { fetchTransactions } from '../utils/api';
import { fetchStockData, getStockPrice } from '../utils/api';
import { handleAssetNameChange, handleInputChange } from '../utils/dataRegistration';
import AssetTracker from '@/app/components/AssetTracker';
// import { TRANSACTION_DATA, TRANSACTION_DATA_1 } from '@/app/data/transactionsMockup'
import { initializeStockData } from '@/app/utils/api'
import { addSymbolColor } from '@/app/constants/assetColors'
import { Transaction } from "@/app/types/transaction";

export let indicatorAmount = 0.01;


async function amountCalculator(cash: number, date: Date): Promise<number> {
  // 주어진 날짜에 대한 주가 가져오기
  const indicatorPrice = await getStockPrice('^GSPC', date) * 1400;
  console.log("mmmIndicatorAmountCalculator ",await getStockPrice('^GSPC', date));
  // 계산 결과 반환 (숫자)
  console.log("mmmIndicatorAmountCalculator ",date, cash, indicatorPrice, cash / indicatorPrice);
  return cash / indicatorPrice;
}

//수정 임시 여기 TRANSACTION_DATA 다 existingTransactions 로 바꾸기
export default function Home() {
  const [isChartDataReady, setIsChartDataReady] = useState(false);
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>();
  const [modifiedTransactions, setModifiedTransactions] = useState<Transaction[]>();
  const [koreanStocks, setKoreanStocks] = useState<StockListElement[]>([]);
  const [americanStocks, setAmericanStocks] = useState<StockListElement[]>([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTransactions(setExistingTransactions);
        await fetchTransactions(setModifiedTransactions);
        await fetchStockData("korean_stocks", setKoreanStocks);
        await fetchStockData("american_stocks", setAmericanStocks);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (existingTransactions && existingTransactions.length > 0) {
      const initializeChart = async () => {
        try {
          await getChartData();
        } catch (error) {
          console.error("Error initializing chart data:", error);
        }
      };
  
      initializeChart();
    }
  }, [existingTransactions]);
  

  async function getChartData() {
    try {
      if (!existingTransactions || existingTransactions.length === 0) {
        throw new Error("No transactions available to initialize chart data.");
      }

      //today block 을 만들기 위해 뒤에 추가
      // setExistingTransactions([...existingTransactions, createTodayTransaction()]);
      // TRANSACTION_DATA에서 모든 고유한 심볼을 추출
      console.log("kkkkkexistingTransactions : ", existingTransactions)


      // const symbols = ['^GSPC', '020180.KQ', '326030.KS', '005930.KS', 'NVDA', 'WMT', '009520.KQ'];
      const symbols = Array.from(new Set(existingTransactions.map(t => t.asset_symbol).filter(Boolean).concat('^GSPC')));


      // maxAssetValue = Math.max(maxAssetValue, await calculateMaxAssetValue(history));
      const firstDeposit = existingTransactions[0].transaction_amount;
      
      console.log('indicatorAmount : ', indicatorAmount);
      // console.log('Starting to initialize stock data for symbols:', symbols);
      await initializeStockData(symbols);
      // console.log('Stock data initialization completed');
      // printCachedStockData();
      // 모든 고유한 심볼에 색상 배정
      symbols.forEach(symbol => {
        addSymbolColor(symbol);
      });
      console.log('Stock color initialization completed');
      indicatorAmount = await amountCalculator(firstDeposit, existingTransactions[0].transaction_date); // 필수
      setIsChartDataReady(true);
      
    } catch (error) {
      console.error('Error initializing chart data:', error);
      // 오류 처리 로직 (예: 사용자에게 오류 메시지 표시)
    }
  }

  useEffect(() => {
    setCurrentEditIndex(2);
  }, []);

  return (
    <div className="flex flex-col space-y-8 bg-gray-100">
      <Dashboard />
      <div className="flex flex-row p-6 m-8 bg-white rounded-2xl border border-gray-200">
        {/* {isChartDataReady ? (
          <CustomFlowChart transactions={existingTransactions} setCurrentEditIndex={setCurrentEditIndex} />
        ) : (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>)} */}
        {isChartDataReady ? (
          <CustomFlowChart transactions={existingTransactions} setCurrentEditIndex={setCurrentEditIndex} />
        ) : (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>)}
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
        {/* {currentEditIndex >= 0 && modifiedTransactions&& isChartDataReady ? (
          <CustomFlowChart transactions={modifiedTransactions} />
        ) : (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>)} */}

      </div>
      {existingTransactions && existingTransactions.length > 0 && (
        <AssetTracker transactionData={existingTransactions} />
      )}


    </div>
  );
}
// function createTodayTransaction(): Transaction {
//   return {
//     id: -1,
//     transaction_date: new Date(),
//     transaction_type: "buy",
//     asset_category: "deposit",
//     asset_symbol: null,
//     asset_name: null,
//     quantity: 0,
//     transaction_amount: 1,
//   };
// }

export const EditTransactionRow = ({
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