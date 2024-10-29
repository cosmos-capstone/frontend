// app/page.tsx
'use client';



import { useEffect, useRef, useState } from 'react';


interface Transaction {
  id: number;
  transaction_date: string;
  transaction_type: string;
  asset_category: string | null;
  stock_code: string | null;
  stock_name: string | null;
  bond_name: string | null;
  quantity: number;
  transaction_amount: string;
}

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  value: number;
  date?: string;
  remainingValue?: number;
  stockName?: string;
  quantity?: number;
  currentHoldings?: number;
  isSellDeposit?: boolean;
}

interface Flow {
  source: string;
  target: string;
  value: number;
  color: string;
  isSellFlow?: boolean;
  sourceName?: string;
  targetName?: string;
  date?: string;
  stockName?: string;
  sourceNode?: Node;
  targetNode?: Node;
}

interface HoverInfo {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 900; // 높이 증가
const PADDING = 50;
const COLUMN_WIDTH = 250; // 열 간격
const NODE_WIDTH = 20;
const NODE_HEIGHT = 60;
const NODE_SPACING = 80; // 노드 간 세로 간격

const COLORS = {
  deposit: '#7FB7BE',
  american_stock: '#F2D0A4',
  korean_stock: '#F1828D',
  etf: '#8FBC94',
};

// 샘플 데이터 (실제 데이터로 교체 필요)
const TRANSACTION_DATA: Transaction[] = [
  {
    "id": 1,
    "transaction_date": "2023-01-01T00:00:00Z",
    "transaction_type": "deposit",
    "asset_category": null,
    "stock_code": null,
    "stock_name": null,
    "bond_name": null,
    "fund_name": null,
    "quantity": 0,
    "transaction_amount": "6000000.00"
  },
  {
    "id": 2,
    "transaction_date": "2023-05-04T13:23:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "SPY",
    "stock_name": "SPDR S&P500 ETF 트러스트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "545065.00"
  },
  {
    "id": 3,
    "transaction_date": "2023-06-02T12:08:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "SPY",
    "stock_name": "SPDR S&P500 ETF 트러스트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "559699.00"
  },
  {
    "id": 4,
    "transaction_date": "2023-09-05T13:39:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "SPY",
    "stock_name": "SPDR S&P500 ETF 트러스트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "593889.00"
  },
  {
    "id": 5,
    "transaction_date": "2024-04-22T23:07:48Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "VOO",
    "stock_name": "뱅가드 S&P500 ETF",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "672890.00"
  },
  {
    "id": 6,
    "transaction_date": "2024-07-30T23:08:40Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "VOO",
    "stock_name": "뱅가드 S&P500 ETF",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "728123.00"
  },
  {
    "id": 7,
    "transaction_date": "2024-01-28T23:07:20Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "QQQM",
    "stock_name": "인베스코 나스닥 100 ETF",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "249091.00"
  },
  {
    "id": 8,
    "transaction_date": "2024-04-17T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "088980",
    "stock_name": "맥쿼리인프라",
    "bond_name": null,
    "fund_name": null,
    "quantity": 40,
    "transaction_amount": "501200.00"
  },
  {
    "id": 9,
    "transaction_date": "2023-12-13T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "379800",
    "stock_name": "KODEX 미국S&P500TR",
    "bond_name": null,
    "fund_name": null,
    "quantity": 20,
    "transaction_amount": "276400.00"
  },
  {
    "id": 10,
    "transaction_date": "2024-02-07T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "379810",
    "stock_name": "KODEX 미국나스닥100TR",
    "bond_name": null,
    "fund_name": null,
    "quantity": 20,
    "transaction_amount": "313700.00"
  },
  {
    "id": 11,
    "transaction_date": "2024-02-17T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "stock_code": "379810",
    "stock_name": "KODEX 미국나스닥100TR",
    "bond_name": null,
    "fund_name": null,
    "quantity": 5,
    "transaction_amount": "78425.00"
  },
  {
    "id": 12,
    "transaction_date": "2024-03-01T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "AAPL",
    "stock_name": "애플",
    "bond_name": null,
    "fund_name": null,
    "quantity": 2,
    "transaction_amount": "456780.00"
  },
  {
    "id": 13,
    "transaction_date": "2024-03-15T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "SPY",
    "stock_name": "SPDR S&P500 ETF 트러스트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "615000.00"
  },
  {
    "id": 14,
    "transaction_date": "2024-03-20T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "005930",
    "stock_name": "삼성전자",
    "bond_name": null,
    "fund_name": null,
    "quantity": 50,
    "transaction_amount": "412500.00"
  },
  {
    "id": 15,
    "transaction_date": "2024-03-25T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "stock_code": "088980",
    "stock_name": "맥쿼리인프라",
    "bond_name": null,
    "fund_name": null,
    "quantity": 10,
    "transaction_amount": "128000.00"
  },
  {
    "id": 16,
    "transaction_date": "2024-04-01T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "MSFT",
    "stock_name": "마이크로소프트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "527890.00"
  },
  {
    "id": 17,
    "transaction_date": "2024-04-05T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "QQQM",
    "stock_name": "인베스코 나스닥 100 ETF",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "262000.00"
  },
  {
    "id": 18,
    "transaction_date": "2024-04-10T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "035720",
    "stock_name": "카카오",
    "bond_name": null,
    "fund_name": null,
    "quantity": 20,
    "transaction_amount": "456000.00"
  },
  {
    "id": 19,
    "transaction_date": "2024-04-15T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "stock_code": "005930",
    "stock_name": "삼성전자",
    "bond_name": null,
    "fund_name": null,
    "quantity": 20,
    "transaction_amount": "168000.00"
  },
  {
    "id": 20,
    "transaction_date": "2024-04-20T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "NVDA",
    "stock_name": "엔비디아",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "892450.00"
  },
  {
    "id": 21,
    "transaction_date": "2024-05-01T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "AAPL",
    "stock_name": "애플",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "234500.00"
  },
  {
    "id": 22,
    "transaction_date": "2024-05-05T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "373220",
    "stock_name": "LG에너지솔루션",
    "bond_name": null,
    "fund_name": null,
    "quantity": 2,
    "transaction_amount": "856000.00"
  },
  {
    "id": 23,
    "transaction_date": "2024-05-10T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "korean_stock",
    "stock_code": "035720",
    "stock_name": "카카오",
    "bond_name": null,
    "fund_name": null,
    "quantity": 10,
    "transaction_amount": "235000.00"
  },
  {
    "id": 24,
    "transaction_date": "2024-05-15T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "american_stock",
    "stock_code": "GOOGL",
    "stock_name": "알파벳",
    "bond_name": null,
    "fund_name": null,
    "quantity": 2,
    "transaction_amount": "456780.00"
  },
  {
    "id": 25,
    "transaction_date": "2024-05-20T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "VOO",
    "stock_name": "뱅가드 S&P500 ETF",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "745000.00"
  },
  {
    "id": 26,
    "transaction_date": "2024-06-01T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "207940",
    "stock_name": "삼성바이오로직스",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "785000.00"
  },
  {
    "id": 27,
    "transaction_date": "2024-06-05T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "MSFT",
    "stock_name": "마이크로소프트",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "567890.00"
  },
  {
    "id": 28,
    "transaction_date": "2024-06-10T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "005380",
    "stock_name": "현대차",
    "bond_name": null,
    "fund_name": null,
    "quantity": 5,
    "transaction_amount": "456000.00"
  },
  {
    "id": 29,
    "transaction_date": "2024-06-15T15:00:00Z",
    "transaction_type": "sell",
    "asset_category": "american_stock",
    "stock_code": "NVDA",
    "stock_name": "엔비디아",
    "bond_name": null,
    "fund_name": null,
    "quantity": 1,
    "transaction_amount": "923450.00"
  },
  {
    "id": 30,
    "transaction_date": "2024-06-20T15:00:00Z",
    "transaction_type": "buy",
    "asset_category": "korean_stock",
    "stock_code": "051910",
    "stock_name": "LG화학",
    "bond_name": null,
    "fund_name": null,
    "quantity": 2,
    "transaction_amount": "892000.00"
  }
];


const processTransactions = (transactions: Transaction[]) => {
  const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
  );

  const monthDiff = (d1: Date, d2: Date) => {
      return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
  };

  const firstDate = new Date(sortedTransactions[0].transaction_date);
  const lastDate = new Date(sortedTransactions[sortedTransactions.length - 1].transaction_date);
  const totalMonths = monthDiff(firstDate, lastDate) + 1;

  const nodes: Node[] = [];
  const flows: Flow[] = [];
  const stockHoldings: { [key: string]: number } = {};
  const depositNodes: { [date: string]: Node } = {};

  // 노드 위치 계산 함수
  const calculateNodePosition = (index: number, columnIndex: number, totalColumns: number) => {
      const columnWidth = (CANVAS_WIDTH - (PADDING * 2)) / totalColumns;
      const x = PADDING + (columnIndex * columnWidth);
      
      const columnNodes = nodes.filter(n => 
          Math.abs(n.x - x) < columnWidth/2
      ).length;
      
      const y = PADDING + (columnNodes * NODE_SPACING);
      
      return { x, y };
  };

  // 날짜별 deposit 노드 가져오기 또는 생성
  const getOrCreateDepositNode = (dateStr: string, index: number, monthIndex: number) => {
      if (!depositNodes[dateStr]) {
          const position = calculateNodePosition(index, monthIndex, totalMonths);
          depositNodes[dateStr] = {
              id: `deposit_${dateStr}`,
              x: position.x,
              y: position.y,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              color: COLORS.deposit,
              value: 0,
              date: dateStr,
              remainingValue: 0
          };
          nodes.push(depositNodes[dateStr]);
      }
      return depositNodes[dateStr];
  };

  let currentNodeIndex = 0;
  sortedTransactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const monthIndex = monthDiff(firstDate, date);
      const dateStr = date.toISOString().split('T')[0];
      const amount = parseFloat(transaction.transaction_amount);

      switch (transaction.transaction_type) {
          case 'deposit': {
              const depositNode = getOrCreateDepositNode(dateStr, currentNodeIndex, monthIndex);
              depositNode.value += amount;
              depositNode.remainingValue = (depositNode.remainingValue || 0) + amount;
              break;
          }

          case 'buy': {
              const position = calculateNodePosition(currentNodeIndex, monthIndex, totalMonths);
              const stockNode: Node = {
                  id: `${transaction.stock_code}_${dateStr}`,
                  x: position.x,
                  y: position.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  color: getStockColor(transaction.asset_category),
                  value: amount,
                  date: dateStr,
                  stockName: transaction.stock_name,
                  quantity: transaction.quantity
              };
              nodes.push(stockNode);

              // 주식 보유량 업데이트
              stockHoldings[transaction.stock_code] = 
                  (stockHoldings[transaction.stock_code] || 0) + transaction.quantity;

              // 구매 자금 흐름 생성
              let remainingPurchase = amount;
              const availableDeposits = Object.values(depositNodes)
                  .filter(node => node.date! <= dateStr)
                  .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

              for (const depositNode of availableDeposits) {
                  if (remainingPurchase <= 0) break;
                  if (depositNode.remainingValue <= 0) continue;

                  const flowAmount = Math.min(depositNode.remainingValue, remainingPurchase);
                  flows.push({
                      source: depositNode.id,
                      target: stockNode.id,
                      value: flowAmount,
                      color: `${stockNode.color}80`,
                      sourceNode: depositNode,
                      targetNode: stockNode,
                      date: dateStr
                  });

                  depositNode.remainingValue -= flowAmount;
                  remainingPurchase -= flowAmount;
              }
              break;
          }

          case 'sell': {
              const depositNode = getOrCreateDepositNode(dateStr, currentNodeIndex, monthIndex);
              depositNode.value += amount;
              depositNode.remainingValue = (depositNode.remainingValue || 0) + amount;

              // 판매하는 주식 노드 찾기
              const sourceStockNode = [...nodes]
                  .reverse()
                  .find(n => n.id.startsWith(transaction.stock_code));

              if (sourceStockNode) {
                  flows.push({
                      source: sourceStockNode.id,
                      target: depositNode.id,
                      value: amount,
                      color: `${COLORS.deposit}80`,
                      isSellFlow: true,
                      sourceNode: sourceStockNode,
                      targetNode: depositNode,
                      date: dateStr
                  });
              }

              // 주식 보유량 업데이트
              stockHoldings[transaction.stock_code] = 
                  (stockHoldings[transaction.stock_code] || 0) - transaction.quantity;
              break;
          }
      }
      
      currentNodeIndex++;
  });

  // 노드 위치 최종 조정
  const maxY = Math.max(...nodes.map(n => n.y)) + NODE_HEIGHT;
  const scale = Math.min(1, (CANVAS_HEIGHT - PADDING * 2) / maxY);
  
  nodes.forEach(node => {
      node.y = PADDING + (node.y - PADDING) * scale;
      node.height = NODE_HEIGHT * scale * node.value * 0.000001;
      

      if (!node.id.startsWith('deposit')) {
          const stockCode = node.id.split('_')[0];
          if (stockHoldings[stockCode] <= 0) {
              node.color = adjustColor(node.color, 50);
              node.height = Math.max(20, node.height * 0.5);
          }
          node.currentHoldings = stockHoldings[stockCode] || 0;
      }
  });

  return { 
      nodes, 
      flows, 
      totalMonths,
      firstDate,
      lastDate,
      stockHoldings 
  };
};




const getStockColor = (category: string | null): string => {
  switch (category) {
    case 'american_stock':
      return COLORS.american_stock;
    case 'korean_stock':
      return COLORS.korean_stock;
    default:
      return COLORS.etf;
  }
};



const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>({
    x: 0, y: 0, content: '', visible: false
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { nodes, flows } = processTransactions(TRANSACTION_DATA);

    const hoveredNode = nodes.find(node =>
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    );

    if (hoveredNode) {
      let content = `${hoveredNode.id.split('_')[0]}\n${formatMoney(hoveredNode.value)}`;
      if (hoveredNode.id.startsWith('deposit')) {
        const depositNode = hoveredNode as Node & { remainingValue: number };
        content += `\n남은 금액: ${formatMoney(depositNode.remainingValue)}`;
      }
      content += `\n${hoveredNode.date}`;

      setHoverInfo({
        x: event.clientX,
        y: event.clientY,
        content,
        visible: true
      });
      canvas.style.cursor = 'pointer';
      return;
    }


    setHoverInfo(prev => ({ ...prev, visible: false }));
    canvas.style.cursor = 'default';
  };

  const handleMouseLeave = () => {
    setHoverInfo(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { nodes, flows } = processTransactions(TRANSACTION_DATA);

    const drawTimeAxis = () => {
      const dates = nodes.map(node => node.date).filter((date): date is string => !!date);
      const minDate = new Date(Math.min(...dates.map(d => new Date(d).getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => new Date(d).getTime())));

      ctx.beginPath();
      ctx.moveTo(PADDING, CANVAS_HEIGHT - 30);
      ctx.lineTo(CANVAS_WIDTH - PADDING, CANVAS_HEIGHT - 30);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();

      dates.forEach(date => {
        const x = getXPositionForDate(new Date(date), minDate, maxDate);

        ctx.beginPath();
        ctx.moveTo(x, CANVAS_HEIGHT - 35);
        ctx.lineTo(x, CANVAS_HEIGHT - 25);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(formatDate(date), x, CANVAS_HEIGHT - 10);
      });
    };

    const drawNode = (node: Node) => {
      const gradient = ctx.createLinearGradient(node.x, node.y, node.x + node.width, node.y);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, adjustColor(node.color, 20));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(node.x, node.y, node.width, node.height, 5);
      ctx.fill();

      ctx.strokeStyle = adjustColor(node.color, -20);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = 'bold 12px Arial';
      const label = `${node.id.split('_')[0]}\n${formatMoney(node.value)}`;
      const lines = label.split('\n');
      const lineHeight = 14;
      const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(
        node.x - (textWidth / 2) + (node.width / 2) - 4,
        node.y - (lineHeight * lines.length) - 8,
        textWidth + 8,
        (lineHeight * lines.length) + 6
      );

      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          node.x + (node.width / 2),
          node.y - (lineHeight * (lines.length - i - 1)) - 6
        );
      });
    };

    const drawFlow = (flow: Flow) => {
      const sourceNode = nodes.find(n => n.id === flow.source);
      const targetNode = nodes.find(n => n.id === flow.target);

      if (!sourceNode || !targetNode) return;

      const startX = sourceNode.x + sourceNode.width;
      const startY = sourceNode.y + (sourceNode.height / 2);
      const endX = targetNode.x;
      const endY = targetNode.y + (targetNode.height / 2);

      const thickness = Math.max(2, (flow.value / getMaxFlowValue(flows)) * 30);

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      const distance = endX - startX;
      const cp1x = startX + (distance * 0.4);
      const cp2x = startX + (distance * 0.6);

      ctx.bezierCurveTo(
        cp1x, startY,
        cp2x, endY,
        endX, endY
      );

      ctx.strokeStyle = flow.color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const drawLegend = () => {
      const legendX = PADDING;
      const legendY = PADDING;
      const itemHeight = 25;
      const boxSize = 15;

      ctx.font = '14px Arial';
      ctx.textAlign = 'left';

      Object.entries(COLORS).forEach(([key, color], index) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          legendX,
          legendY + (index * itemHeight),
          boxSize,
          boxSize
        );

        ctx.fillStyle = '#000';
        ctx.fillText(
          formatLegendLabel(key),
          legendX + boxSize + 10,
          legendY + (index * itemHeight) + 12
        );
      });
    };

    flows.forEach(drawFlow);
    nodes.forEach(drawNode);
    drawTimeAxis();
    drawLegend();

  }, []);

  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '1px solid #ccc',
          background: 'white'
        }}
      />
      {hoverInfo.visible && (
        <div className="tooltip" style={{
          position: 'fixed',
          left: `${hoverInfo.x + 10}px`,
          top: `${hoverInfo.y + 10}px`,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 1000,
          whiteSpace: 'pre-line'
        }}>
          {hoverInfo.content}
        </div>
      )}
    </div>
  );
};

// 유틸리티 함수들
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getXPositionForDate = (date: Date, minDate: Date, maxDate: Date): number => {
  const totalDays = maxDate.getTime() - minDate.getTime();
  const daysSinceStart = date.getTime() - minDate.getTime();
  const position = (daysSinceStart / totalDays) * (CANVAS_WIDTH - (PADDING * 2));
  return PADDING + position;
};

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
};

const formatLegendLabel = (key: string): string => {
  const labels: { [key: string]: string } = {
    deposit: '예치금',
    american_stock: '미국 주식',
    korean_stock: '한국 주식',
    etf: 'ETF'
  };
  return labels[key] || key;
};

const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getMaxFlowValue = (flows: Flow[]): number => {
  return Math.max(...flows.map(f => f.value));
};



export default Home;