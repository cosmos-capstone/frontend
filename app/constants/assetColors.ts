// constants/assetColors.ts 
export const ASSET_COLORS = {
    'DEPOSIT': '#dc3545', // 빨간색
    '^GSPC': '#B0C5D9', 
    
  };

  

// 색상 리스트: 이미 사용한 색상은 여기서 제거됩니다.
const stockColors = {
  'korean_stock': [
    '#a9f1dd', '#8eeed0', '#73e0c4', '#5fc9b7', '#4fb9ab',
    '#35d5a0', '#2dc094', '#20a988', '#1e967c', '#188270'
  ],
  'american_stock': [
    '#b3d2ff', '#9ecaff', '#85b3f2', '#6ca6e0', '#5299d8',
    '#338bff', '#1a7eff', '#2078c0', '#1a6a99', '#135477'
  ]
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
 