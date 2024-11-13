// components/CustomFlowChart.tsx
'use client';
import { useEffect, useState } from 'react';
import { trackAssets } from '../utils/assetTracker'
interface Node {
    id: string;
    date: string;
    amount: number;
    asset_symbol: string;
    position: {
      x_position: number;
      y_position: number;
    };
    type: 'deposit' | 'american_stock' | 'korean_stock';
    action: 'buy' | 'sell';
  }
  
  const CustomFlowChart = ({ transactions }: { transactions: Transaction[] }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
  
    useEffect(() => {
      const assetHistory = trackAssets(transactions);
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
  
      // 각 거래 시점마다 노드 생성
      // Edge 생성 로직
      assetHistory.forEach((history, timeIndex) => {
        const xPosition = timeIndex * 200;
        let yPosition = 100;
        const yGap = 100;
  
        // deposit 노드 생성
        const depositNode: Node = {
          id: `deposit-${timeIndex}`,
          date: history.date,
          amount: history.state.cash,
          asset_symbol: 'DEPOSIT',
          position: {
            x_position: xPosition,
            y_position: yPosition
          },
          type: 'deposit',
          action: 'buy'
        };
        newNodes.push(depositNode);
  
        // 보유 주식 노드 생성
        Object.entries(history.state.holdings).forEach(([symbol, quantity], assetIndex) => {
          const stockNode: Node = {
            id: `${symbol}-${timeIndex}`,
            date: history.date,
            amount: quantity,
            asset_symbol: symbol,
            position: {
              x_position: xPosition,
              y_position: yPosition + ((assetIndex + 1) * yGap)
            },
            type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
            action: 'buy'
          };
          newNodes.push(stockNode);
        });
      });
  
      // Edge 생성 로직
    assetHistory.forEach((history, timeIndex) => {
        if (timeIndex === 0) return; // 첫 번째 시점은 건너뜀
  
        // 현재 시점의 거래 찾기
        const currentTransaction = transactions.find(t => t.transaction_date === history.date);
        
// deposit 노드 간 연결
      const previousDepositNode = newNodes.find(n => 
        n.asset_symbol === 'DEPOSIT' && 
        n.date === assetHistory[timeIndex - 1].date
      );
      const currentDepositNode = newNodes.find(n => 
        n.asset_symbol === 'DEPOSIT' && 
        n.date === history.date
      );
      
      // deposit 연속성 엣지 추가
      if (previousDepositNode && currentDepositNode) {
        newEdges.push({
          id: `deposit-continuity-${timeIndex}`,
          source: previousDepositNode.id,
          target: currentDepositNode.id,
          type: 'buy'  // deposit 연속성도 'buy'로 표시
        });
      }

        if (currentTransaction && (currentTransaction.transaction_type === 'buy' || currentTransaction.transaction_type === 'sell')) {
          if (currentTransaction.transaction_type === 'buy') {
            // 매수: 이전 deposit -> 현재 매수 자산
            const previousDepositNode = newNodes.find(n => 
              n.asset_symbol === 'DEPOSIT' && 
              n.date === assetHistory[timeIndex - 1].date
            );
            const targetNode = newNodes.find(n =>
              n.asset_symbol === currentTransaction.asset_symbol && 
              n.date === history.date
            );
  
            if (previousDepositNode && targetNode) {
              newEdges.push({
                id: `trade-buy-${timeIndex}-${currentTransaction.asset_symbol}`,
                source: previousDepositNode.id,
                target: targetNode.id,
                type: 'buy'
              });
            }
          } else if (currentTransaction.transaction_type === 'sell' && timeIndex < assetHistory.length - 1) {
            // 매도: 현재 매도 자산 -> 다음 시점 deposit
            const sourceNode = newNodes.find(n =>
              n.asset_symbol === currentTransaction.asset_symbol && 
              n.date === history.date
            );
            const nextDepositNode = newNodes.find(n => 
              n.asset_symbol === 'DEPOSIT' && 
              n.date === assetHistory[timeIndex + 1].date
            );
  
            if (sourceNode && nextDepositNode) {
              newEdges.push({
                id: `trade-sell-${timeIndex}-${currentTransaction.asset_symbol}`,
                source: sourceNode.id,
                target: nextDepositNode.id,
                type: 'sell'
              });
            }
          }
        }
  
        // 시점 간 자산 연속성 연결
        newNodes
          .filter(node => node.date === history.date)
          .forEach(currentNode => {
            const previousNode = newNodes.find(n => 
              n.asset_symbol === currentNode.asset_symbol && 
              n.date === assetHistory[timeIndex - 1].date
            );
  
            if (previousNode) {
              // 거래가 없는 경우에만 시점 간 연결
              const hasTransaction = currentTransaction && 
                (currentTransaction.asset_symbol === currentNode.asset_symbol ||
                 currentNode.asset_symbol === 'DEPOSIT');
  
              if (!hasTransaction) {
                newEdges.push({
                  id: `continuity-${timeIndex}-${currentNode.asset_symbol}`,
                  source: previousNode.id,
                  target: currentNode.id,
                  type: 'buy' // 연속성을 나타내는 엣지는 'buy'로 표시
                });
              }
            }
          });
      });
  
      setNodes(newNodes);
      setEdges(newEdges);
    }, [transactions]);

  const Edge = ({ edge }: { edge: Edge }) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const startX = sourceNode.position.x_position + 60;
    const startY = sourceNode.position.y_position + 30;
    const endX = targetNode.position.x_position;
    const endY = targetNode.position.y_position + 30;

    return (
      <path
        d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2} ${endX} ${endY}`}
        stroke={edge.type === 'buy' ? 'green' : 'red'}
        strokeWidth="2"
        fill="none"
        markerEnd={`url(#arrow-${edge.type})`}
      />
    );
  };

  const Node = ({ node }: { node: Node }) => {
    const getBackgroundColor = (type: string) => {
      switch(type) {
        case 'deposit': return '#e6f3ff';
        case 'american_stock': return '#f0fff0';
        case 'korean_stock': return '#fff0f0';
        default: return '#ffffff';
      }
    };

    const backgroundColor = getBackgroundColor(node.type);
    const formattedDate = new Date(node.date).toLocaleDateString();
    const label = node.type === 'deposit' 
      ? `Deposit\n${formattedDate}\n₩${node.amount.toLocaleString()}`
      : `${node.asset_symbol}\n${formattedDate}\n수량: ${node.amount}`;

    return (
      <g transform={`translate(${node.position.x_position},${node.position.y_position})`}>
        <rect
          width="120"
          height="70"
          rx="5"
          ry="5"
          fill={backgroundColor}
          stroke="#1a192b"
          strokeWidth="1"
        />
        {label.split('\n').map((line, i) => (
          <text
            key={i}
            x="60"
            y={20 + i * 15}
            textAnchor="middle"
            fontSize="12"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={Math.max(1000, nodes.length * 200)} height={800}>
        <defs>
          <marker
            id="arrow-buy"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="green" />
          </marker>
          <marker
            id="arrow-sell"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="red" />
          </marker>
        </defs>
        {edges.map(edge => (
          <Edge key={edge.id} edge={edge} />
        ))}
        {nodes.map(node => (
          <Node key={node.id} node={node} />
        ))}
      </svg>
    </div>
  );
};

export default CustomFlowChart;