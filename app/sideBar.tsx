'use client';

import React, { useState } from 'react';
import { Dashboard, PieChart, BarChart, Person, Settings } from '@mui/icons-material';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div style={styles.sidebar}>
      <nav style={styles.nav}>
        <MenuItem
          icon={<Dashboard />}
          text="Dashboard"
          isActive={activeItem === "Dashboard"}
          onClick={() => setActiveItem("Dashboard")}
        />
        <MenuItem
          icon={<PieChart />}
          text="Portfolio"
          isActive={activeItem === "Portfolio"}
          onClick={() => setActiveItem("Portfolio")}
        />
        <MenuItem
          icon={<BarChart />}
          text="Data Registration"
          isActive={activeItem === "Data Registration"}
          onClick={() => setActiveItem("Data Registration")}
        />
        <MenuItem
          icon={<Person />}
          text="Accounts"
          isActive={activeItem === "Accounts"}
          onClick={() => setActiveItem("Accounts")}
        />
        <MenuItem
          icon={<Settings />}
          text="Setting"
          isActive={activeItem === "Setting"}
          onClick={() => setActiveItem("Setting")}
        />
      </nav>
    </div>
  );
}

const MenuItem = ({ icon, text, isActive, onClick }) => (
  <div
    style={isActive ? styles.activeMenuItem : styles.menuItem}
    onClick={onClick}
  >
    <span style={styles.icon}>{icon}</span>
    <span style={isActive ? styles.activeText : styles.text}>{text}</span>
  </div>
);

const styles = {
  sidebar: {
    width: '200px',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    color: '#aaa',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  activeMenuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    color: '#007bff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    borderRadius: '5px',
    backgroundColor: '#f0f8ff',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '18px',
    marginRight: '10px',
  },
  text: {
    fontSize: '14px',
  },
  activeText: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};