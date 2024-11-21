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
    <div className="m-8">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">자산 개요</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData &&
          Object.keys(assetNameMap).map(
            (key) =>
              dashboardData[key] > 0 && (
                <div
                  key={key}
                  className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-200"
                >
                  <div className="text-sm text-gray-500">{assetNameMap[key]}</div>
                  <div className="text-2xl font-bold text-gray-800 mt-2">
                    {Math.floor(dashboardData[key]).toLocaleString()}원
                  </div>
                </div>
              )
          )}
        {!dashboardData && (
          <div className="text-center w-full text-xl text-gray-500">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
