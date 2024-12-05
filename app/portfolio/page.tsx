// Portfolio.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PieChart, { PieChartData } from '../components/PieChart';
import BarChart, { SharpeRatioData } from '../components/BarChart';
import ImageWithBackground from '../components/ImageWithBackground';
import correlationData from '../data/correlationData .json';
import sectorData from '../data/sectorData.json';

interface PortfolioData {
  [key: string]: string;
}


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

const sectorTranslations = {
  "Communication Services": "커뮤니케이션 서비스",
  "Utilities": "유틸리티",
  "Basic Materials": "기초 자재",
  "Industrials": "산업재",
  "Energy": "에너지",
  "Financial Services": "금융 서비스",
  "Real Estate": "부동산",
  "Healthcare": "헬스케어",
  "Consumer Defensive": "필수 소비재",
  "Technology": "기술",
  "Consumer Cyclical": "선택 소비재"
};

const Portfolio = () => {
  const [existingData, setExistingData] = useState<PieChartData | null>(null);
  const [proposedData, setProposedData] = useState<PieChartData | null>(null);
  const [topAssets, setTopAssets] = useState<{ name: string; value: string }[]>([]);
  const [sharpeData, setSharpeData] = useState<SharpeRatioData | null>(null);
  const [stocksData, setStocks] = useState<{ [key: string]: { rate: string; sector: string; industry: string } } | null>(null);
  const [recommendedSectors, setRecommendedSectors] = useState<string[]>([]);
  const [sectorDistribution, setSectorDistribution] = useState<{ [sector: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const por_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/portfolio');
        const por_data = await por_response.json();
        console.log(por_data);

        const reb_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/rebalancing');
        const reb_data = await reb_response.json();

        // 아직 사용 안함
        const stock_response = await fetch('https://cosmos-backend.cho0h5.org/transaction/asset');
        const stock_data = await stock_response.json();

        const portfolioData: PieChartData = por_data.data;
        const rebalancingData: PieChartData = reb_data.data;

        const sharpe_ratios: SharpeRatioData = {
          korean_stock: 0.6,
          american_stock: 0.8,
          korean_bond: 0.42,
          american_bond: 0.57,
          fund: 0.3,
          commodity: 0.2,
          gold: 0.2,
        };
        setSharpeData(sharpe_ratios);
        setExistingData(portfolioData);
        setProposedData(rebalancingData);
        setStocks(stock_data.data);

        calculateSectorDistribution(stock_data.data);

        recommendSectors(stock_data.data);


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
  }, []);

  const calculateSectorDistribution = (stocks: { [key: string]: { rate: string; sector: string } }) => {
    if (!stocks) return;

    const sectorRates: { [sector: string]: number } = {};

    Object.values(stocks).forEach(({ sector, rate }) => {
      if (sector && sector !== 'N/A' && sector !== 'none') {
        sectorRates[sector] = (sectorRates[sector] || 0) + parseFloat(rate);
      }
    });

    setSectorDistribution(sectorRates);
  };

  const recommendSectors = (stocks: { [key: string]: { rate: string; sector: string } }) => {
    if (!stocks) return;
  
    const threshold = 20;
    // 섹터 비율 계산
    const sectorRates: { [sector: string]: number } = {};
    Object.values(stocks).forEach(({ sector, rate }) => {
      if (sector && sector !== 'N/A' && sector !== 'none') {
        sectorRates[sector] = (sectorRates[sector] || 0) + parseFloat(rate);
      }
    });
  
    setSectorDistribution(sectorRates);
  
    // 특정 섹터 비율이 기준을 초과하는지 확인
    const overInvestedSectors = Object.entries(sectorRates)
      .filter(([, rate]) => rate > threshold)
      .map(([sector]) => sector);
  
    if (overInvestedSectors.length > 0) {
      // 추천 섹터 계산
      const recommendations = Object.entries(correlationData)
        .filter(([sector]) => !overInvestedSectors.includes(sector))
        .sort(([, a], [, b]) => Math.min(...Object.values(a)) - Math.min(...Object.values(b)))
        .slice(0, 3)
        .map(([sector]) => sector);
  
      setRecommendedSectors(recommendations);
    } else {
      setRecommendedSectors([]); // 추천 섹터 초기화
    }
  };
  


  return (
    <>
      <div className="p-8">
        <h2 className="text-center mb-10 font-bold text-3xl">포트폴리오 리밸런싱</h2>
        <div className="flex justify-around">
          <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
            <h3 className="mb-5 font-bold text-3xl">기존 포트폴리오</h3>
            {existingData ? <PieChart data={existingData} /> : <div>Loading...</div>}
          </div>

          <div className="w-2/5 bg-gray-200 rounded-lg p-8 shadow-lg text-center">
            <h3 className="mb-5 font-bold text-3xl">제안 포트폴리오</h3>
            {proposedData ? <PieChart data={proposedData} /> : <div>Loading...</div>}
            {/* <span className='font-semibold'>샤프 지수를 기반으로</span> */}
            <Link
              className="mt-5 text-gray-500 text-sm underline"
              href="/backtesting"
            >
              포트폴리오 성능 검증 페이지로 이동
            </Link>
          </div>
        </div>
        <h2 className="text-center mt-20 font-bold text-3xl">포트폴리오 분석</h2>
      </div>

      <div className="p-8 flex items-center bg-white" style={{ height: '500px' }}>
        <p className="text-2xl font-semibold mb-1 ml-20">각 자산들의 샤프 지수는 다음과 같아요 </p>
      </div>

      <div className='items-center justify-centera\'>
        <div className="p-8 flex bg-white ml-10" style={{ height: '500px', width: '700px' }}>
          {sharpeData ? <BarChart data={sharpeData} /> : <div>Loading Sharpe Ratios...</div>}

          <div className='item-start' style={{ width: '500px' }}>
            <p className="text-lg font-semibold mb-1 ml-10" style={{ width: '500px' }}><br /> <span className="text-2xl font-bold">샤프 지수란</span> <br /><br />
              변동성 대비 수익률을 뜻해요 (초과 수익/표준 편차)
              <br />
              <br />
              <br />
              <span className="text-gray-500">
                샤프 지수가 높은 투자 자산일수록 변동성이 적고 수익률이 높아요
                <br />안정적인 포트폴리오를 구성하기 위해서는 샤프 지수가 높은 자산을 많이 포함하는 것이 좋아요
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 flex ml-40 items-center bg-white mt-10">
        <div className='mr-20'>
          <p className="text-xl font-bold mb-4 ">기존 <span style={{ color: '#3B82F6' }}>김코스</span>님의 자산은</p>
          <p className="text-lg font-medium mb-4">
            {topAssets.map((asset, index) => (
              <span style={{ color: '#3B82F6', fontWeight: 'bold' }} key={index}>
                {asset.name}
                {index < topAssets.length - 1 && ', '}
              </span>
            ))}에 가장 많이 분포되어 있어요.
          </p>
            <h2 className="text-center font-bold text-xl ml-80 mt-20">그 중에서도 다음 업종에 주로 투자하셨어요</h2>
        </div>

      </div>

      
      <div className="p-8 rounded-lg flex items-center justify-center">
        <div className="justify-center">
          {stocksData ? (
            Object.entries(stocksData)
              .filter(([, value]) => value.sector !== "N/A" && value.industry !== "N/A" && value.sector !== "none")
              .sort(([, a], [, b]) => parseFloat(b.rate) - parseFloat(a.rate))
              .slice(0, 3)
              .map(([key, value], index) => (
                <div key={index} className="flex items-center mb-3">
                  <ImageWithBackground
                    // 이부분 로컬에선 /images로 github에선 ./image로 변경
                    src={value.sector && value.sector != "none" ? `/images/${value.sector}.png` : `/page.tsximages/Other.png`}
                    alt={value.sector && value.sector !== "none" ? `${value.sector} Sector` : "Other Sector"}
                  />
                  <div className="ml-4">
                    <p className="text-xl font-bold text-blue-600">{index + 1}위</p>
                    <p className="text-lg text-gray-600">{key}</p>
                    <p className='font-bold'>{sectorTranslations[value.sector] || value.sector}</p>
                    <p className='text-red-500 font-bold'>{value.rate}%</p>
                  </div>
                </div>
                
              )
            )
          ) : (
            <p className="text-center">No stocks data available.</p>
          )}
        </div>
      
        <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-96 text-center ml-20">
          <p className="text-xl font-bold mb-6 text-blue-500">TOP3 업종 분포</p>
          {Object.entries(sectorDistribution)
            .sort(([, rateA], [, rateB]) => rateB - rateA) // 비율 기준으로 내림차순 정렬
            .slice(0, 3) // 상위 3개 섹터 선택
            .map(([sector, rate]) => (
              <div key={sector} className="mb-4">
                <p className="text-lg font-semibold mb-1">
                  {sectorTranslations[sector] || sector}: {rate.toFixed(2)}%
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${rate}%` }} // 비율에 따라 막대 길이 설정
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>




      <div className="p-8 rounded-lg">
  {Object.entries(sectorDistribution)
    .sort(([, rateA], [, rateB]) => rateB - rateA) // 비율 기준 내림차순 정렬
    .slice(0, 1) // 비중이 가장 높은 섹터 1개 선택
    .map(([sector]) => (
      <div key={sector} className="mb-4">
        <p className="text-lg font-semibold mb-1 flex justify-center mb-10">
          <span className="text-blue-600 mr-1">
            {sectorTranslations[sector] || sector}
          </span>
          업종의 비중이 높습니다. 더 다양한 업종을 추천드릴게요.
        </p>
      </div>
    ))}
  <p className="text-right mr-40 mb-8">{sectorData.lastUpdated} 기준 업데이트</p>

  {recommendedSectors.length > 0 ? (
    <div className="flex flex-wrap justify-center items-center gap-20">
      {recommendedSectors.map((sector, index) => (
        <div
          key={index}
          className="bg-gray-100 p-4 rounded-lg shadow flex flex-col items-center min-w-[300px]"
        >
          {/* 섹터 이미지와 이름 */}
          <div className="flex items-center mb-4">
            <ImageWithBackground
              src={sector && sector !== "none" ? `/images/${sector}.png` : `/images/Other.png`}
              alt={`${sectorTranslations[sector] || sector} Sector`}
            />
            <h3 className="text-blue-600 font-bold ml-4">
              {sectorTranslations[sector] || sector} 섹터
            </h3>
          </div>

          {/* 섹터 상세 정보 */}
          {sectorData[sector] ? (
            <div className="flex flex-col gap-8">
              {/* 시가총액 상위 종목 */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-bold mb-2">시가총액 상위 종목</h4>
                <ul className="list-disc list-inside">
                  {sectorData[sector].topMarketCap.map((stock, idx) => (
                    <li key={idx} className="mb-2">
                      <span>{idx + 1}위</span>
                      <p className="text-gray-700 font-semibold">{stock.name}</p>
                      <p className="text-gray-500">
                        시가총액: <span className='font-bold'>
                          <span className="text-red-500 font-bold">
                          {stock.marketCap.toLocaleString()} USD
                          </span>
                          </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1년 수익률 상위 종목 */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-bold mb-2">1년 상승률 상위 종목</h4>
                <ul className="list-disc list-inside">
                  {sectorData[sector].topYTDReturn.map((stock, idx) => (
                    <li key={idx} className="mb-2">
                      <span>{idx + 1}위</span>
                      <p className="text-gray-700 font-semibold">{stock.name}</p>
                      <p className="text-gray-500">
                        1년 상승률: <span className='text-red-500 font-bold'>
                          {(stock.YTD_return * 100).toFixed(2)}%
                          </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              {sectorTranslations[sector]} 섹터의 데이터가 아직 준비되지 않았습니다.
            </p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-green-600 font-semibold">
      현재 포트폴리오는 안정적입니다!
    </p>
  )}
</div>




</>
  );
};

export default Portfolio;