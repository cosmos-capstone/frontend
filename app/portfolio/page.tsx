'use client';

import React, { useEffect, useState } from 'react';
import PieChart from '../components/PieChart';

const Portfolio = () => {
  const [existingData, setExistingData] = useState<any>(null);
  const [proposedData, setProposedData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cosmos-backend.cho0h5.org/transaction/portfolio');
        const data = await response.json();
        const portfolioData = data.data;

        setExistingData(portfolioData);
        setProposedData(portfolioData); // Example modification for proposed portfolio
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 font-sans">
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

export default Portfolio;