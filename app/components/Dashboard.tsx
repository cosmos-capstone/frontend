

export default function Dashboard() {
  return (
    <div style={styles.dashboard}>
      <div style={styles.overview}>
        <h2>Overview</h2>
        <div style={styles.statistics}>
          <div style={styles.statItem}>
            <div>총 자산</div>
            <div>$50,000</div>
          </div>
          <div style={styles.statItem}>
            <div>주식</div>
            <div>$100,000</div>
          </div>
          <div style={styles.statItem}>
            <div>ETF</div>
            <div>$500,000</div>
          </div>
          <div style={styles.statItem}>
            <div>채권</div>
            <div>$500,000</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

const styles = {
  dashboard: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  overview: {
    marginBottom: '10px',
  },
  statistics: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  statItem: {
    textAlign: 'center',
    backgroundColor: '#f1f3f6',
    padding: '15px',
    borderRadius: '8px',
    width: '22%',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  chart: {
    marginTop: '20px',
    // 여기에 차트 관련 스타일 추가 가능
  },
};