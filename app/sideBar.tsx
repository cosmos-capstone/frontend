'use client';

import React, { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, PieChart, BarChart, Person, Settings } from '@mui/icons-material';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div style={styles.sidebar}>
      <nav style={styles.nav}>
        <MenuItem icon={<Dashboard />} text="Dashboard" path="/" isActive={location.pathname === "/"} />
        <MenuItem icon={<PieChart />} text="Portfolio" path="/portfolio" isActive={location.pathname === "/portfolio"} />
        <MenuItem icon={<BarChart />} text="Data Registration" path="/data-registration" isActive={location.pathname === "/data-registration"} />
        <MenuItem icon={<Person />} text="Accounts" path="/accounts" isActive={location.pathname === "/accounts"} />
        <MenuItem icon={<Settings />} text="Setting" path="/setting" isActive={location.pathname === "/setting"} />
      </nav>
    </div>
  );
}

const MenuItem = ({ icon, text, path, isActive }) => (
  <Link to={path} style={styles.link}>
    <div style={isActive ? styles.activeMenuItem : styles.menuItem}>
      <span style={styles.icon}>{icon}</span>
      <span style={isActive ? styles.activeText : styles.text}>{text}</span>
    </div>
  </Link>
);

const styles: { [key: string]: CSSProperties } = {
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
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
};
