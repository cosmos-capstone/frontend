'use client'

import { useState } from 'react';

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
    setCategories({
      ...categories,
      [e.target.name]: e.target.checked,
    });
  };

  const handleIndexChange = (e) => {
    setIndices({
      ...indices,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', border: '1px solid #ddd', color: '#333' }}>
      <h3>옵션 선택</h3>
      <div>
        <h4>그래프 표시 항목</h4>
        {Object.entries(categories).map(([key, value]) => (
          <div key={key}>
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={handleCategoryChange}
            />
            <label>{key}</label>
          </div>
        ))}
      </div>
      <div>
        <h4>기간 설정</h4>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <h4>지표 표시 유무</h4>
        {Object.entries(indices).map(([key, value]) => (
          <div key={key}>
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={handleIndexChange}
            />
            <label>{key.toUpperCase()}</label>
          </div>
        ))}
      </div>
    </div>
  );
}