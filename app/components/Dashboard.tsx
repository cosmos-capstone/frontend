import React, { useEffect, useState } from 'react';

interface DashboardData {
  total_assets: number;
  korean_stock: number;
  american_stock: number;
  korean_bond: number;
  american_bond: number;
  commodity: number;
  gold: number;
  deposit: number;
  savings_account: number;
  cash: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const assetNameMap: { [key: string]: string } = {
    total_assets: "총 자산",
    korean_stock: "한국 주식",
    american_stock: "미국 주식",
    korean_bond: "한국 채권",
    american_bond: "미국 채권",
    commodity: "원자재",
    gold: "금",
    deposit: "예금",
    savings_account: "저축 계좌",
    cash: "현금"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://cosmos-backend.cho0h5.org/transaction/portfolio_sum');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const portfolioData = data.data;

        const sanitizedData: DashboardData = Object.keys(assetNameMap).reduce((acc, key) => {
          acc[key] = portfolioData[key] ?? 0;
          return acc;
        }, {} as DashboardData);

        setDashboardData(sanitizedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  });

  return (
    <div className="m-8 bg-gradient-to-br from-gray-100 to-white p-10 rounded-3xl shadow-2xl">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">자산 개요</h2>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {dashboardData && Object.keys(assetNameMap).map((key) => (
          dashboardData[key] > 0 && (
            <div key={key} className="flex justify-between items-center p-4 bg-gray-200 text-gray-800 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/4">
              <div className="text-lg font-medium">{assetNameMap[key]}</div>
              <div className="text-3xl font-bold">{Math.floor(dashboardData[key]).toLocaleString()}원</div>
            </div>
          )
        ))}
        {!dashboardData && <div className="text-center w-full text-xl text-gray-500">Loading...</div>}
      </div>
    </div>
  );
}
