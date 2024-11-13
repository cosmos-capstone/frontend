'use client';

import React, { useEffect, useState } from 'react';
import PieChart, { PieChartData } from '../components/PieChart';

interface PortfolioData {
  [key: string]: string;
}

const Portfolio = () => {
  const [existingData, setExistingData] = useState<PieChartData | null>(null);
  const [proposedData, setProposedData] = useState<PieChartData | null>(null);
  const [topAssets, setTopAssets] = useState<{ name: string; value: string }[]>([]);

  const assetNameMap = {
    "korean_stock": "한국 주식",
    "american_stock": "미국 주식",
    "korean_bond": "한국 채권",
    "american_bond": "미국 채권",
    "commodity": "원자재",
    "gold": "금",
    "deposit": "예금",
    "savings_account": "저축 계좌",
    "cash": "현금"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const por_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/portfolio');
        const por_data = await por_response.json();

        const reb_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/rebalancing');
        const reb_data = await reb_response.json();

        const portfolioData: PieChartData = por_data.data;
        const rebalancingData: PieChartData = reb_data.data;

        setExistingData(portfolioData);
        setProposedData(rebalancingData);

        // 상위 3개의 자산 항목을 추출하여 상태에 저장
        const sortedData = Object.entries(por_data.data as PortfolioData)
          .map(([name, value]) => ({
            name: assetNameMap[name] || name, // 한글 이름으로 변환
            value: parseFloat(value),
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 3) // 상위 3개 항목 가져오기
          .map(({ name, value }) => ({ name, value: value.toFixed(2) }));

        setTopAssets(sortedData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="p-8">
        <h2 className="text-center mb-10 font-bold text-3xl">포르폴리오 리밸런싱</h2>
        <div className="flex justify-around">
          <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
            <h3 className="mb-5 font-bold text-3xl">기존 포트폴리오</h3>
            {existingData ? <PieChart data={existingData} /> : <div>Loading...</div>}
          </div>

          <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
            <h3 className="mb-5 font-bold text-3xl">제안 포트폴리오</h3>
            {proposedData ? <PieChart data={proposedData} /> : <div>Loading...</div>}
          </div>
        </div>
        <h2 className="text-center mt-20 font-bold text-3xl">포트폴리오 분석</h2>
      </div>

      {/* 상위 3개의 자산을 표시하는 카드 */}
      <div className="p-8 flex justify-center items-center bg-white">
        <div>
          <p className="text-xl font-bold mb-4">기존 김코스님의 자산은</p>
          <p className="text-lg font-medium mb-4">
              {topAssets.map((asset, index) => (
                  <span key={index}>
                      {asset.name}
                      {index < topAssets.length - 1 && ', '}
                  </span>
              ))}에 가장 많이 분포되어 있어요.
          </p>
        </div>

        <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-96 text-center ml-60">
          <p className="text-xl font-bold mb-4">TOP3 자산 분포</p>
          {topAssets.map((asset, index) => (
              <p key={index} className="text-lg mb-2">
                  {asset.name}: {asset.value}%
              </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
