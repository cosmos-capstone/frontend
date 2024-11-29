'use client';

import React, { useEffect, useState } from 'react';
import PieChart, { PieChartData } from '../components/PieChart';

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

    useEffect(() => {
        // const portfolioData: PieChartData = por_data.data;
        // const rebalancingData: PieChartData = reb_data.data;
        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/portfolio', setExistingData);
        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/rebalancing', setCurrProposedData);
        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=2023-11-29', setPrev1ProposedData);
        fetchAndSetData('https://cosmos-backend.cho0h5.org/transaction/rebalancing?date=2019-11-29', setPrev5ProposedData);
    }, []);

    return (
        <>
            <div className="p-8">
                <div className="p-8">
                    <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                        <h3 className="mb-5 font-bold text-3xl">기존 포트폴리오</h3>
                        {existingData ? <PieChart data={existingData} /> : <div>Loading...</div>}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="p-8">
                    <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                        <h3 className="mb-5 font-bold text-3xl">현재 제안 포트폴리오</h3>
                        {currProposedData ? <PieChart data={currProposedData} /> : <div>Loading...</div>}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="p-8">
                    <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                        <h3 className="mb-5 font-bold text-3xl">1년 전 제안 포트폴리오</h3>
                        {prev1ProposedData ? <PieChart data={prev1ProposedData} /> : <div>Loading...</div>}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="p-8">
                    <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
                        <h3 className="mb-5 font-bold text-3xl">5년 전 제안 포트폴리오</h3>
                        {prev5ProposedData ? <PieChart data={prev5ProposedData} /> : <div>Loading...</div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompareRebalancing;