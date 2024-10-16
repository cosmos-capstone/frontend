import React from 'react';
import SankeyChartWrapper from './graphWrapper';
import Dashboard from './dashBoard';
import styles from './styles/page.module.css';
import TopBar from './topBar';

export default function Home() {
  return (
    <div className={styles.container}>
      <TopBar />
      <h1>Energy Flow Sankey Diagram</h1>
      <div className={styles.flexContainer}>
        <SankeyChartWrapper />
        <Dashboard />
      </div>
    </div>
  );
}