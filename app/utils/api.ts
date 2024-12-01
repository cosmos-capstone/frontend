import { TransactionResponseItem } from '../types/transactionResponseItem';
import { Transaction } from '../types/transaction';
import { StockListElement } from '../types/stockListElement';

import {StockPrice,StockData} from '@/app/types/typePriceAPI'

interface StockDataItem {
  name: string;
  symbol: string;
}
export async function fetchTransactions(setExistingTransactions: (transactions: Transaction[]) => void) {
    const res = await fetch("https://cosmos-backend.cho0h5.org/transaction/test");
    const data = await res.json() as { data: TransactionResponseItem[] };
    const sortedData = data.data.map((item: TransactionResponseItem) => ({
        ...item,
        transaction_date: new Date(item.transaction_date)
    })).sort((a: Transaction, b: Transaction) => a.transaction_date.getTime() - b.transaction_date.getTime());
    setExistingTransactions(sortedData);
}

export async function fetchStockData(endpoint: string, setState: (data: StockListElement[]) => void) {
    const res = await fetch(`https://cosmos-backend.cho0h5.org/market_data/${endpoint}`);
    const data = await res.json() as { data: StockDataItem[] };
    const transformedData = data.data.map((stock: StockDataItem) => ({ label: stock.name, value: stock.symbol }));
    setState(transformedData);
}

export async function getStockPrice(symbol: string, date: Date): Promise<number | null> {
    try {
      const response = await fetch(`https://cosmos-backend.cho0h5.org/market_data/stock/${symbol}/prices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: StockData = await response.json();
      
      const dateString = date.toISOString().split('T')[0];
      const priceData = data.data.find(price => price.datetime.startsWith(dateString));
  
      if (priceData) {
        return parseFloat(priceData.close_price);
      } else {
        console.log(`No price data available for ${symbol} on ${dateString}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      return null;
    }
  }