// constants/assetColors.ts 
export const ASSET_COLORS = {
    'DEPOSIT': '#dc3545', // 빨간색
    'SPY': '#8fbc8f', // 연두색
    'VOO': '#98fb98', // 연두록색
    'AAPL': '#ff7f50', // 코랄색
    '005930.KS': '#ffa07a', // 연주황색
    '035720.KS': '#ffd700', // 금색
    'MSFT': '#87ceeb', // 하늘색
    'NVDA': '#da70d6', // 보라색
    'GOOGL': '#6495ed'  // 중청색
  };

  

// 색상 리스트: 이미 사용한 색상은 여기서 제거됩니다.
const stockColors = {
  'korean_stock': ['#a9f1dd', '#8eeed0', '#73ebc4', '#59e9b7', '#3fe6ab', '#20c997', '#1cab8c', '#178d71', '#127056', '#0d523b'],
  'american_stock': ['#b3d2ff', '#99c4ff', '#80b6ff', '#66a8ff', '#4d99ff', '#0d6efd', '#0b62e4', '#0945b3', '#073982', '#052c61']
};

// 색상 선택 함수
const getStockColor = (symbol: string) => {
  const type = symbol.includes('.KS') ? 'korean_stock' : 'american_stock';
  const colors = stockColors[type];
  
  if (colors.length === 0) {
    throw new Error(`No more colors available for ${type}`);
  }

  // 랜덤으로 색상을 선택
  const randomIndex = Math.floor(Math.random() * colors.length);
  const selectedColor = colors[randomIndex];

  // 선택된 색상을 리스트에서 제거
  colors.splice(randomIndex, 1);

  return selectedColor;
};

// ASSET_COLORS에 symbol 추가 함수
export const addSymbolColor = (symbol: string) => {
  if (!ASSET_COLORS[symbol]) {  // symbol이 아직 ASSET_COLORS에 없을 때만 추가
    ASSET_COLORS[symbol] = getStockColor(symbol);
  }
};
 