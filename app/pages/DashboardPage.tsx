import React from 'react';
import SankeyChartWrapper from '../graphWrapper';
import Dashboard from '../dashBoard';
import styles from '../styles/page.module.css';
import TopBar from '../topBar';
import Sidebar from '../sideBar';

export default function Home() {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.flexContainer}>
      <Sidebar />
        <SankeyChartWrapper />
        <Dashboard />
      </div>
    </div>
  );
}