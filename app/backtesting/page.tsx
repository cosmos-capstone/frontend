'use client';

import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import PieChart, { PieChartData } from '../components/PieChart';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { Transaction } from '../types/transaction';
import { fetchTransactions } from '../utils/api';
import { TransactionResponseItem } from '../types/transactionResponseItem';
import { initializeStockData } from '@/app/utils/api'
import { addSymbolColor } from '@/app/constants/assetColors'
import { getStockPrice } from '../utils/api';

let indicatorAmount = 0.01;

async function amountCalculator(cash: number, date: Date): Promise<number> {
    // 주어진 날짜에 대한 주가 가져오기
    const indicatorPrice = await getStockPrice('^GSPC', date) * 1400;
    console.log("mmmIndicatorAmountCalculator ", await getStockPrice('^GSPC', date));
    // 계산 결과 반환 (숫자)
    console.log("mmmIndicatorAmountCalculator ", date, cash, indicatorPrice, cash / indicatorPrice);
    return cash / indicatorPrice;
}

const fetchAndSetData = async (url, setData) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data.data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
};

async function fetchProposedTransactions(
    setExistingTransactions: (transactions: Transaction[]) => void,
    date: string // 추가된 쿼리 파라미터
) {
    // 요청 URL에 date 쿼리 파라미터 추가
    const res = await fetch(`https://cosmos-backend.cho0h5.org/transaction/rebalanced_transaction?date=${date}`);

    // 응답 처리
    const data = await res.json() as { data: TransactionResponseItem[] };

    // 데이터 변환 및 정렬
    const sortedData = data.data.map((item: TransactionResponseItem) => ({
        ...item,
        transaction_date: new Date(item.transaction_date)
    })).sort((a: Transaction, b: Transaction) =>
        a.transaction_date.getTime() - b.transaction_date.getTime()
    );

    // 상태 업데이트
    setExistingTransactions(sortedData);
}

const noop: Dispatch<SetStateAction<number>> = () => { };

const CompareRebalancing = () => {
    const [currProposedData, setCurrProposedData] = useState<PieChartData | null>(null);
    const [prev1ProposedData, setPrev1ProposedData] = useState<PieChartData | null>(null);
    const [prev5ProposedData, setPrev5ProposedData] = useState<PieChartData | null>(null);

    const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
    const [prev1ProposedTransactions, setPrev1ProposedTransactions] = useState<Transaction[]>([]);
    const [prev5ProposedTransactions, setPrev5ProposedTransactions] = useState<Transaction[]>([]);

    const [isChartDataReady, setIsChartDataReady] = useState(false);

    useEffect(() => {
        console.log(isChartDataReady);
        const currentDate = new Date();
        const prev1YearDate = new Date(currentDate);
        prev1YearDate.setFullYear(prev1YearDate.getFullYear() - 1);
        const prev5YearDate = new Date(currentDate);
        prev5YearDate.setFullYear(prev5YearDate.getFullYear() - 5);

        const prev1YearDateString = prev1YearDate.toISOString().split('T')[0];
        const prev5YearDateString = prev5YearDate.toISOString().split('T')[0];

        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/rebalancing', setCurrProposedData);
        fetchAndSetData(`https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=${prev1YearDateString}`, setPrev1ProposedData);
        fetchAndSetData(`https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=${prev5YearDateString}`, setPrev5ProposedData);

        fetchTransactions(setExistingTransactions);
        fetchProposedTransactions(setPrev1ProposedTransactions, prev1YearDateString);
        fetchProposedTransactions(setPrev5ProposedTransactions, prev5YearDateString);
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
            const symbols = Array.from(new Set(existingTransactions.map(t => t.asset_symbol).filter(Boolean).concat('^GSPC').concat('102110.KS').concat('SPY').concat('BND')));


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


    return (
        <>
            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">현재 제안 포트폴리오</h3>
                    {currProposedData ? <PieChart data={currProposedData} /> : <div>Loading...</div>}
                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={existingTransactions} setCurrentEditIndex={noop} />
                </div>
            </div>

            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">1년 전 제안 포트폴리오</h3>
                    {prev1ProposedData ? <PieChart data={prev1ProposedData} /> : <div>Loading...</div>}
                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={prev1ProposedTransactions} setCurrentEditIndex={noop} />
                </div>
            </div>

            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">5년 전 제안 포트폴리오</h3>
                    {prev5ProposedData ? <PieChart data={prev5ProposedData} /> : <div>Loading...</div>}
                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={prev5ProposedTransactions} setCurrentEditIndex={noop} />
                </div>
            </div>
        </>
    )
}

export default CompareRebalancing;