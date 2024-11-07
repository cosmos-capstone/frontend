'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import PieChart from '../components/PieChart';
import { ChartData } from 'chart.js';

const PortfolioAnalysis = () => {
  const [existingData, setExistingData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [proposedData, setProposedData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cosmos-backend.cho0h5.org/transaction/portfolio');
        const data = await response.json();
        const portfolioData = data.data;

        const formattedData = [
          { name: 'Korean Stock', value: parseFloat(portfolioData.korean_stock), color: '#20c997' },
          { name: 'American Stock', value: parseFloat(portfolioData.american_stock), color: '#0d6efd' },
          { name: 'Korean Bond', value: parseFloat(portfolioData.korean_bond), color: '#6f42c1' },
          { name: 'American Bond', value: parseFloat(portfolioData.american_bound), color: '#d63384' },
          { name: 'Fund', value: parseFloat(portfolioData.fund), color: '#ffc107' },
          { name: 'Commodity', value: parseFloat(portfolioData.commodity), color: '#fd7e14' },
          { name: 'Gold', value: parseFloat(portfolioData.gold), color: '#dc3545' },
          { name: 'Deposit', value: parseFloat(portfolioData.deposit), color: '#6610f2' },
          { name: 'Cash', value: parseFloat(portfolioData.cash), color: '#198754' },
        ];

        setExistingData({
          labels: formattedData.map(item => item.name),
          datasets: [
            {
              data: formattedData.map(item => item.value),
              backgroundColor: formattedData.map(item => item.color),
              borderColor: formattedData.map(item => item.color),
              borderWidth: 1,
            },
          ],
        });

        setProposedData({
          labels: formattedData.map(item => item.name),
          datasets: [
            {
              data: formattedData.map(item => item.value), // Example modification for proposed portfolio
              backgroundColor: formattedData.map(item => item.color),
              borderColor: formattedData.map(item => item.color),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 font-sans">
      <h2 className="text-center mb-10 font-bold text-2xl">포트폴리오 분석</h2>
      <div className="flex justify-around">
        <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
          <h3 className="mb-5 font-bold text-xl">기존 포트폴리오</h3>
          <PieChart data={existingData} />
          <div className="mt-8 bg-white p-4 rounded-lg text-left leading-relaxed">
            <p>sharp ratio</p>
            <p>1년 과거 수익률</p>
            <p>MDD</p>
          </div>
        </div>

        <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
          <h3 className="mb-5 font-bold text-xl">제안 포트폴리오</h3>
          <PieChart data={proposedData} />
          <div className="mt-8 bg-white p-4 rounded-lg text-left leading-relaxed">
            <p>이렇게 추천하는 이유</p>
            <p>예상 수익률</p>
            <p>MDD</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalysis;
