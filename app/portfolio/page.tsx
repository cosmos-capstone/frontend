// Portfolio.tsx

'use client';

import React, { useEffect, useState } from 'react';
import PieChart, { PieChartData } from '../components/PieChart';
import BarChart, { SharpeRatioData } from '../components/BarChart';

interface PortfolioData {
  [key: string]: string;
}

const Portfolio = () => {
  const [existingData, setExistingData] = useState<PieChartData | null>(null);
  const [proposedData, setProposedData] = useState<PieChartData | null>(null);
  const [topAssets, setTopAssets] = useState<{ name: string; value: string }[]>([]);
  const [sharpeData, setSharpeData] = useState<SharpeRatioData | null>(null);

  // const [stocks, setStocks] = useState<{ name: string; value: string }[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // const stock_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/asset');
        // const stock_data = await stock_response.json();

        const portfolioData: PieChartData = por_data.data;
        const rebalancingData: PieChartData = reb_data.data;

        const sharpe_ratios: SharpeRatioData = {
          korean_stock: 0.6,
          american_stock: 0.8,
          korean_bond: 0.79,
          american_bond: 0.05,
          fund: 0.3,
          commodity: 0.2,
          gold: 0.2,
          deposit: 0.03
        };
        setSharpeData(sharpe_ratios);
        setExistingData(portfolioData);
        setProposedData(rebalancingData);
        // setStocks(stock_data);

        // 상위 3개의 자산 항목을 추출하여 상태에 저장
        const sortedData = Object.entries(por_data.data as PortfolioData)
          .map(([name, value]) => ({
            name: assetNameMap[name] || name,
            value: parseFloat(value),
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(({ name, value }) => ({ name, value: value.toFixed(2) }));

        setTopAssets(sortedData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchData();
  }, [assetNameMap]);

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
          <p className="text-xl font-bold mb-4 ">기존 <span style={{ color: '#3B82F6' }}>김코스</span>님의 자산은</p>
          <p className="text-lg font-medium mb-4">
              {topAssets.map((asset, index) => (
                  <span style={{ color: '#3B82F6', fontWeight: 'bold'}} key={index}>
                      {asset.name}
                      {index < topAssets.length - 1 && ', '}
                  </span>
              ))}에 가장 많이 분포되어 있어요.
          </p>
        </div>

      <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-96 text-center ml-60">
        <p className="text-xl font-bold mb-4 text-blue-500">TOP3 자산 분포</p>
          {topAssets.map((asset, index) => (
              <div key={index} className="mb-4">
                  <p className="text-lg font-semibold mb-1">{asset.name}: {asset.value}%</p>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                      <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${asset.value}%` }}
                      ></div>
                  </div>
              </div>
          ))}
      </div>
      </div>

      <div className="p-8 flex items-center bg-white" style={{ height: '500px' }}>
        <p className="text-2xl font-semibold mb-1 ml-20">각 자산들의 샤프 지수는 다음과 같아요 </p>
      </div>

      <div className='items-center justify-center'>
        <div className="p-8 flex items-center bg-white" style={{ height: '500px', width: '700px' }}>
            {sharpeData ? <BarChart data={sharpeData} /> : <div>Loading Sharpe Ratios...</div>}

            <div className='item-start' style={{width: '500px'}}>
              <p className="text-lg font-semibold mb-1 ml-20" style={{width: '500px'}}>샤프 지수란 <br />
              변동성 대비 수익률을 뜻해요
              </p>
              
            </div>
            
            
        </div>
      </div>

    </>
  );
};

export default Portfolio;
