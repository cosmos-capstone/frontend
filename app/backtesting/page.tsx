'use client';

import React, { useEffect, useState } from 'react';
import PieChart, { PieChartData } from '../components/PieChart';
import CustomFlowChart from '../components/CustomFlowChart/index';
import { Transaction } from '../types/transaction';
import { fetchTransactions } from '../utils/api';

const fetchAndSetData = async (url, setData) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data.data);
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
};

const CompareRebalancing = () => {
    const [existingData, setExistingData] = useState<PieChartData | null>(null);
    const [currProposedData, setCurrProposedData] = useState<PieChartData | null>(null);
    const [prev1ProposedData, setPrev1ProposedData] = useState<PieChartData | null>(null);
    const [prev5ProposedData, setPrev5ProposedData] = useState<PieChartData | null>(null);

    const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const currentDate = new Date();
        const prev1YearDate = new Date(currentDate);
        prev1YearDate.setFullYear(prev1YearDate.getFullYear() - 1);
        const prev5YearDate = new Date(currentDate);
        prev5YearDate.setFullYear(prev5YearDate.getFullYear() - 5);

        const prev1YearDateString = prev1YearDate.toISOString().split('T')[0];
        const prev5YearDateString = prev5YearDate.toISOString().split('T')[0];

        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/portfolio', setExistingData);
        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/rebalancing', setCurrProposedData);
        fetchAndSetData(`https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=${prev1YearDateString}`, setPrev1ProposedData);
        fetchAndSetData(`https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=${prev5YearDateString}`, setPrev5ProposedData);

        fetchTransactions(setExistingTransactions);
    }, []);

    return (
        <>
            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">기존 포트폴리오</h3>
                    {existingData ? <PieChart data={existingData} /> : <div>Loading...</div>}
                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={existingTransactions} />
                </div>
            </div>

            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">현재 제안 포트폴리오</h3>
                    {currProposedData ? <PieChart data={currProposedData} /> : <div>Loading...</div>}
                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={existingTransactions} />
                </div>
            </div>

            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">1년 전 제안 포트폴리오</h3>
                    {prev1ProposedData ? <PieChart data={prev1ProposedData} /> : <div>Loading...</div>}                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={existingTransactions} />
                </div>
            </div>

            <div className="p-8 flex flex-row space-x-8">
                <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                    <h3 className="mb-5 font-bold text-3xl">5년 전 제안 포트폴리오</h3>
                    {prev5ProposedData ? <PieChart data={prev5ProposedData} /> : <div>Loading...</div>}                </div>

                <div className="flex flex-row p-6 bg-white rounded-2xl border border-gray-200">
                    <CustomFlowChart transactions={existingTransactions} />
                </div>
            </div>
        </>
    )
}

export default CompareRebalancing;