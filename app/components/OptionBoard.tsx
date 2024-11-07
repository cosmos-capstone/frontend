'use client';

import React, { useState, CSSProperties } from 'react';

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
    <div style={styles.container}>
      <h2 style={styles.header}>옵션 선택</h2>

      <div>
        <h4 style={styles.subHeader}>그래프 표시 항목</h4>
        <div style={styles.checkboxGroup}>
          {Object.entries(categories).map(([key, value]) => (
            <div key={key} style={styles.checkbox}>
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleCategoryChange}
                style={styles.input}
              />
              <label style={styles.label}>{key}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={styles.subHeader}>기간 설정</h4>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.dateInput}
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      <div>
        <h4 style={styles.subHeader}>지표 표시 유무</h4>
        <div style={styles.checkboxGroup}>
          {Object.entries(indices).map(([key, value]) => (
            <div key={key} style={styles.checkbox}>
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleIndexChange}
                style={styles.input}
              />
              <label style={styles.label}>{key.toUpperCase()}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: '20px',
    maxWidth: '300px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '18px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  checkboxGroup: {
    marginBottom: '20px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  input: {
    marginRight: '10px',
    accentColor: '#007bff',
  },
  label: {
    fontSize: '14px',
    color: '#333',
  },
  dateInput: {
    display: 'block',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
};
