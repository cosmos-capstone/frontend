'use client';

import React, { CSSProperties } from 'react';

import PieChart from '../components/PieChart';
import { ChartData } from 'chart.js';

const existingPortfolioData = [
  { name: 'Apple', value: 20.28, color: '#20c997' },
  { name: 'Broadcom', value: 13.52, color: '#0d6efd' },
  { name: 'TSLA', value: 4.16, color: '#6f42c1' },
  { name: 'Nvidia', value: 2.08, color: '#d63384' },
];

const proposedPortfolioData = [
  { name: 'Broadcom', value: 26.52, color: '#ffc107' },
  { name: 'TSLA', value: 5.16, color: '#fd7e14' },
  { name: 'Apple', value: 4.28, color: '#dc3545' },
  { name: 'Nvidia', value: 3.08, color: '#6610f2' },
];

const existingData: ChartData<'pie'> = {
  labels: existingPortfolioData.map(item => item.name),
  datasets: [
    {
      data: existingPortfolioData.map(item => item.value),
      backgroundColor: existingPortfolioData.map(item => item.color),
      borderColor: existingPortfolioData.map(item => item.color),
      borderWidth: 1,
    },
  ],
};

const proposedData: ChartData<'pie'> = {
  labels: proposedPortfolioData.map(item => item.name),
  datasets: [
    {
      data: proposedPortfolioData.map(item => item.value),
      backgroundColor: proposedPortfolioData.map(item => item.color),
      borderColor: proposedPortfolioData.map(item => item.color),
      borderWidth: 1,
    },
  ],
};

const PortfolioAnalysis = () => {
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
