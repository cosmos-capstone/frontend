import React from 'react';
import SankeyChartWrapper from '../graphWrapper';
import Dashboard from '../components/Dashboard';
import styles from '../styles/page.module.css';
import TopBar from '../topBar';
import Sidebar from '../sideBar';
import OptionSelector from '../OptionBoard';

export default function Home() {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentContainer}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Dashboard />
          <div className={styles.graphContent}>
            <SankeyChartWrapper />
            <OptionSelector />
          </div>

        </div>
      </div>
    </div>
  );
}