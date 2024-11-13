// components/AssetFlowChart.tsx
'use client';
import { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  ConnectionMode,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface AssetFlowChartProps {
  transactions: Transaction[];
}

export default function AssetFlowChart({ transactions }: AssetFlowChartProps) {
  // 노드와 엣지 생성 함수
  const createFlowElements = useCallback(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // 초기 예금 노드 생성 (시작점)
    const depositNode = {
      id: 'deposit',
      type: 'default',
      data: { label: '초기 예금\n₩6,000,000' },
      position: { x: 0, y: 0 },
      style: {
        background: '#e6f3ff',
        border: '1px solid #1a192b',
        borderRadius: '3px',
        padding: 10,
        fontSize: '12px',
      },
    };
    nodes.push(depositNode);

    let currentY = 100;
    let previousNodes: { [symbol: string]: string } = {};

    transactions.forEach((transaction, index) => {
      if (transaction.transaction_type === 'buy') {
        const nodeId = `${transaction.asset_symbol}-${index}`;
        
        // 매수 거래에 대한 노드 생성
        nodes.push({
          id: nodeId,
          type: 'default',
          data: { 
            label: `${transaction.asset_symbol}\n${transaction.quantity}주\n₩${parseFloat(transaction.transaction_amount).toLocaleString()}` 
          },
          position: { x: 250, y: currentY },
          style: {
            background: '#f0fff0',
            border: '1px solid #1a192b',
            borderRadius: '3px',
            padding: 10,
            fontSize: '12px',
          },
        });

        // 예금 노드에서 매수 노드로 엣지 생성
        edges.push({
          id: `e-deposit-${nodeId}`,
          source: 'deposit',
          target: nodeId,
          animated: true,
          label: '매수',
          style: { stroke: '#00ff00' },
        });

        previousNodes[transaction.asset_symbol] = nodeId;
        currentY += 100;
      } 
      else if (transaction.transaction_type === 'sell') {
        const nodeId = `${transaction.asset_symbol}-${index}`;
        
        // 매도 거래에 대한 노드 생성
        nodes.push({
          id: nodeId,
          type: 'default',
          data: { 
            label: `${transaction.asset_symbol}\n-${transaction.quantity}주\n₩${parseFloat(transaction.transaction_amount).toLocaleString()}` 
          },
          position: { x: 500, y: currentY },
          style: {
            background: '#fff0f0',
            border: '1px solid #1a192b',
            borderRadius: '3px',
            padding: 10,
            fontSize: '12px',
          },
        });

        // 이전 매수 노드에서 매도 노드로 엣지 생성
        if (previousNodes[transaction.asset_symbol]) {
          edges.push({
            id: `e-${previousNodes[transaction.asset_symbol]}-${nodeId}`,
            source: previousNodes[transaction.asset_symbol],
            target: nodeId,
            animated: true,
            label: '매도',
            style: { stroke: '#ff0000' },
          });
        }

        currentY += 100;
      }
    });

    return { nodes, edges };
  }, [transactions]);

  const { nodes, edges } = createFlowElements();

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
