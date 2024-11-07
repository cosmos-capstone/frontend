import React from 'react';
import SankeyChartWrapper from '../components/GraphWrapper';
import Dashboard from '../components/Dashboard';
import styles from '../styles/page.module.css';
import OptionSelector from '../components/OptionBoard';

export default function Home() {
  return (
    <>
      <Dashboard />
      <div className={styles.graphContent}>
        <SankeyChartWrapper />
        <OptionSelector />
      </div>
    </>
  );
}