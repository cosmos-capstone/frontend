import React, { CSSProperties } from 'react';

const DataRegistration = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>매수/매도 입력</h2>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    // padding: '20px',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '40px',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  portfolioSection: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  portfolio: {
    width: '45%',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  totalValue: {
    position: 'absolute',
    top: '140px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#000',
  },
  details: {
    marginTop: '30px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'left',
    lineHeight: '1.6',
  },
};

export default DataRegistration;