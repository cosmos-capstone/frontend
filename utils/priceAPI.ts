export const getCurrentPrice = async (symbol: string): Promise<number> => {
    // 실제 구현 시에는 여기에 실제 API 호출 로직이 들어갈 것입니다.
    // 현재는 임시 값을 반환
    const mockPrices: { [key: string]: number } = {
      'SPY': 500000,
      'VOO': 480000,
      'AAPL': 200000,
      // ... 다른 자산들의 가격
    };
    return mockPrices[symbol] || 0;
  };