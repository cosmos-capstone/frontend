import { TransactionResponseItem } from '../types/transactionResponseItem';
import { Transaction } from '../types/transaction';
import { StockListElement } from '../types/stockListElement';

import { StockPriceData, StockData } from '@/app/types/typePriceAPI'

interface StockDataItem {
    name: string;
    symbol: string;
}
// 주식 데이터를 저장할 객체
export const stockDataCache: { [symbol: string]: StockPriceData } = {};

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









// API에서 주식 데이터를 가져와 캐시에 저장하는 함수
export async function fetchAndCacheStockData(symbol: string): Promise<void> {
    console.log(`bbbAttempting to fetch data for ${symbol}`);
    try {
        const response = await fetch(`https://cosmos-backend.cho0h5.org/market_data/stock/${symbol}/prices`);
        console.log(`bbbResponse status for ${symbol}: ${response.status}`);

        if (!response.ok) {
            throw new Error(`bbbHTTP error! status: ${response.status}`);
        }

        const data: StockPriceData = await response.json();
        console.log(`bbbReceived data for ${symbol}:`, JSON.stringify(data).slice(0, 200) + '...'); // 데이터의 처음 200자만 출력

        stockDataCache[symbol] = data;
        console.log(`bbbSuccessfully fetched and cached data for ${symbol}`);
        console.log(`bbbCache now contains data for symbols: ${Object.keys(stockDataCache).join(', ')}`);
    } catch (error) {
        console.error(`bbbError fetching stock data for ${symbol}:`, error);
        if (error instanceof Error) {
            console.error(`bbbError message: ${error.message}`);
            console.error(`bbbError stack: ${error.stack}`);
        }
    }
}

// 캐시된 데이터에서 특정 날짜의 주식 가격을 가져오는 함수
// 수정 api 파일에 이게 있으면 안됨
export function getStockPrice(symbol: string, date: Date): number | null {
    const stockData = stockDataCache[symbol];
    if (!stockData) {
        console.log(`aaaaNo cached data available for ${symbol}`);
        return null;
    }

    const dateString = date.toISOString().split('T')[0];
    const priceData = stockData.data.find(price => price.datetime.startsWith(dateString));

    if (priceData) {
        const price = parseFloat(priceData.close_price);
        console.log(`aaaRetrieved price for ${symbol} on ${dateString}: ${price}`);
        return price;
    } else {
        console.log(`aaaNo price data available for ${symbol} on ${dateString}`);
        return null;
    }
}

export async function initializeStockData(symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
        await fetchAndCacheStockData(symbol);
    }
}
// 저장된 데이터를 출력하는 함수
export function printCachedStockData(symbol?: string): void {
    console.log("cccprintCachedStockData function called");
    if (symbol) {
        // 특정 심볼의 데이터 출력
        if (stockDataCache[symbol]) {
            const data = stockDataCache[symbol];
            console.log(`Data for ${symbol}:`);
            console.log(`Name: ${data.name}`);
            console.log(`Currency: ${data.currency}`);
            console.log(`Number of price entries: ${data.data.length}`);
            console.log(`First entry: ${data.data[0].datetime}, ${data.data[0].close_price}`);
            console.log(`Last entry: ${data.data[data.data.length - 1].datetime}, ${data.data[data.data.length - 1].close_price}`);
        } else {
            console.log(`cccNo cached data available for ${symbol}`);
        }
    } else {
        // 모든 캐시된 데이터의 요약 출력
        console.log("cccCached Stock Data Summary:");
        for (const [sym, data] of Object.entries(stockDataCache)) {
            console.log(`${sym}: ${data.name}, ${data.data.length} entries`);
        }
    }
}

// export async function getStockPrice(symbol: string, date: Date): Promise<number | null> {
//     try {
//         const response = await fetch(`https://cosmos-backend.cho0h5.org/market_data/stock/${symbol}/prices`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data: StockData = await response.json();

//         const dateString = date.toISOString().split('T')[0];
//         const priceData = data.data.find(price => price.datetime.startsWith(dateString));

//         if (priceData) {
//             console.log(`Successfully fetched price for ${symbol} on ${dateString}: ${price}`);
//             return parseFloat(priceData.close_price);

//         } else {
//             console.log(`No price data available for ${symbol} on ${dateString}`);
//             return null;
//         }
//     } catch (error) {
//         console.error(`Error fetching stock price for ${symbol}:`, error);
//         return null;
//     }
// }