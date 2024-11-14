import React from 'react';
import SankeyChartWrapper from '../components/GraphWrapper';
import Dashboard from '../components/Dashboard';
import OptionSelector from '../components/OptionBoard';

export default function Home() {
  return (
    <>
      <Dashboard />
      <div className="flex flex-row p-5 overflow-y-auto m-8 bg-gradient-to-br from-gray-100 to-white p-10 rounded-3xl shadow-2xl">
        <SankeyChartWrapper />
        <OptionSelector />
      </div>
    </>
  );
}