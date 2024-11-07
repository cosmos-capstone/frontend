'use client';

import React, { CSSProperties } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

const renderCustomizedLabel = ({ value }) => {
  return `${value}B`;
};

const PortfolioAnalysis = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>포트폴리오 분석</h2>
      <div style={styles.portfolioSection}>
        <div style={styles.portfolio}>
          <h3 style={styles.subtitle}>기존 포트폴리오</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={existingPortfolioData}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
              >
                {existingPortfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={styles.details}>sharp ratio<br/>1년 과거 수익률<br/>MDD</div>
        </div>

        <div style={styles.portfolio}>
          <h3 style={styles.subtitle}>제안 포트폴리오</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={proposedPortfolioData}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
              >
                {proposedPortfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={styles.details}>이렇게 추천하는 이유<br/>예상 수익률<br/>MDD</div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    // padding: '20px',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  portfolioSection: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  portfolio: {
    width: '45%',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  totalValue: {
    position: 'absolute',
    top: '140px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#000',
  },
  details: {
    marginTop: '30px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'left',
    lineHeight: '1.6',
  },
};

export default PortfolioAnalysis;
