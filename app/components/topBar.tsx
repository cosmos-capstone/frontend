'use client';

import React from 'react';
import { Search, Settings, Notifications } from '@mui/icons-material';

export default function TopBar() {
  return (
    <div style={styles.topBar}>
      <span style={styles.title}>Overview</span>
      <div style={styles.searchBar}>
        <Search style={styles.icon} />
        <input
          type="text"
          placeholder="Search for something"
          style={styles.input}
        />
      </div>
      <div style={styles.icons}>
        <Settings style={styles.icon} />
        <Notifications style={styles.icon} />
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '2px solid #007bff',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '24px',
    color: '#303030',
    fontWeight: 'bold',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f5f9',
    borderRadius: '20px',
    padding: '5px 10px',
    marginRight: '15px',
  },
  input: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#a0a4a8',
    width: '1000px',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '20px',
    color: '#a0a4a8',
    margin: '0 10px',
    cursor: 'pointer',
  },
};