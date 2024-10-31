
'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
// import DataRegistrationPage from ' ./pages/DataRegistrationPage';
// import AccountsPage from './pages/AccountsPage';
// import SettingPage from './pages/SettingPage';

function App() {
  if (typeof window === 'undefined') {
    return null; // Render nothing on the server
  }

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* <Sidebar /> */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            {/* <Route path="/data-registration" element={<DataRegistrationPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/setting" element={<SettingPage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;