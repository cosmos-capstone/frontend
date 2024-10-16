import React from 'react';

export default function TopBar() {
  return (
    <div style={styles.container}>
      <div style={styles.logoSection}>
        <img src="/path/to/logo.png" alt="Logo" style={styles.logo} />
        <span style={styles.title}>토스증권</span>
      </div>
      <nav style={styles.nav}>
        <span style={styles.navItem}>홈</span>
        <span style={styles.navItem}>뉴스</span>
        <span style={styles.navItem}>주식 골라보기</span>
        <span style={styles.navItem}>내 계좌</span>
      </nav>
      <div style={styles.searchSection}>
        <input type="text" placeholder="종목 검색" style={styles.searchInput} />
        <button style={styles.searchButton}>Q</button>
      </div>
      <button style={styles.loginButton}>로그인</button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#f4f5f7',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '24px',
  },
  title: {
    marginLeft: '8px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navItem: {
    color: '#6b7280',
    cursor: 'pointer',
  },
  searchSection: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: '5px',
    borderRadius: '5px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
  },
  searchButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};