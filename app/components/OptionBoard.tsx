'use client';

import React, { useState } from 'react';

export default function OptionSelector() {
  const [categories, setCategories] = useState({
    cash: true,
    stocks: true,
    bonds: true,
    etf: true,
  });

  const [indices, setIndices] = useState({
    sp500: true,
    kospi200: true,
  });

  const [startDate, setStartDate] = useState('2024-06-10T09:41');
  const [endDate, setEndDate] = useState('2024-06-10T09:41');

  const handleCategoryChange = (e) => {
    setCategories((prevCategories) => ({
      ...prevCategories,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleIndexChange = (e) => {
    setIndices((prevIndices) => ({
      ...prevIndices,
      [e.target.name]: e.target.checked,
    }));
  };

  return (
    <div className="p-5 max-w-sm border border-gray-300 rounded-lg bg-white text-gray-800 font-sans">
      <h2 className="text-lg mb-5 font-bold">옵션 선택</h2>

      <div>
        <h4 className="text-md mb-2 font-bold">그래프 표시 항목</h4>
        <div className="mb-5">
          {Object.entries(categories).map(([key, value]) => (
            <div key={key} className="flex items-center mb-2">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleCategoryChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-800">{key}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md mb-2 font-bold">기간 설정</h4>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block mb-3 p-2 border border-gray-300 rounded-md w-full text-sm"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block mb-3 p-2 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      <div>
        <h4 className="text-md mb-2 font-bold">지표 표시 유무</h4>
        <div className="mb-5">
          {Object.entries(indices).map(([key, value]) => (
            <div key={key} className="flex items-center mb-2">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleIndexChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-800">{key.toUpperCase()}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}