// components/CustomFlowChart.tsx
'use client';
import { useEffect, useState } from 'react';
import { trackAssets } from '../utils/assetTracker';
import { Block } from './Block';
import { Transaction, Node, Edge, Block as BlockType, AssetHistory } from '../type/types';
import { getCurrentPrice } from '../utils/priceAPI';

interface NodeSize {
    width: number;
    height: number;
}

const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
  ): Promise<NodeSize> => {
    const baseWidth = 120;
    const maxHeight = 200;
    const minHeight = 60;
    
    let assetValue: number;
    
    if (node.type === 'deposit') {
      assetValue = node.amount;
    } else {
      const currentPrice = await getCurrentPrice(node.asset_symbol);
      assetValue = currentPrice * node.amount;
    }
  
    const height = Math.max(
      minHeight,
      Math.min(maxHeight, (assetValue / maxAssetValue) * maxHeight)
    );
  
    return {
      width: baseWidth,
      height
    };
  };
  
  const calculateNodePosition = (
    assetSymbol: string,
    previousBlock?: BlockType,
    state: 'before' | 'after' = 'before'
  ) => {
    const defaultYPosition = 100;
    const yGap = 80;
  
    if (previousBlock) {
      const nodes = state === 'before' ? previousBlock.afterNodes : previousBlock.beforeNodes;
      const existingNode = nodes.find(node => node.asset_symbol === assetSymbol);
      if (existingNode) {
        return existingNode.position.y_position;
      }
    }
  
    if (assetSymbol === 'DEPOSIT') return defaultYPosition;
    return defaultYPosition + (yGap * (previousBlock?.afterNodes.length || 1));
  };


  const createBlock = async (
    history: AssetHistory,
    index: number,
    previousBlock?: BlockType
  ): Promise<BlockType> => {
    const blockWidth = 300;
    const blockXPosition = index * (blockWidth + 50);
    const blockHeight = 500;
    const leftMargin = 30;
    const rightMargin = blockWidth - 150;
  
    const beforeNodes: Node[] = [];
    const afterNodes: Node[] = [];
  
    // 최대 자산 가치 계산
    let maxAssetValue = history.state.cash;
    if (history.previousState) {
      maxAssetValue = Math.max(maxAssetValue, history.previousState.cash);
      for (const [symbol, quantity] of Object.entries(history.previousState.holdings)) {
        const price = await getCurrentPrice(symbol);
        maxAssetValue = Math.max(maxAssetValue, price * quantity);
      }
    }
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
      const price = await getCurrentPrice(symbol);
      maxAssetValue = Math.max(maxAssetValue, price * quantity);
    }
  
    // 이전 상태(왼쪽) 노드 생성
    if (history.previousState) {
      let currentY = 50;
  
      // Deposit 노드
      const depositSize = await calculateNodeSize({
        id: `DEPOSIT-${index}-before`,
        date: history.date,
        amount: history.previousState.cash,
        asset_symbol: 'DEPOSIT',
        position: { x_position: 0, y_position: 0 },
        type: 'deposit',
        action: 'buy',
        state: 'before'
      }, maxAssetValue);
  
      beforeNodes.push({
        id: `DEPOSIT-${index}-before`,
        date: history.date,
        amount: history.previousState.cash,
        asset_symbol: 'DEPOSIT',
        position: {
          x_position: leftMargin,
          y_position: currentY
        },
        type: 'deposit',
        action: 'buy',
        state: 'before',
        size: depositSize,
        value: history.previousState.cash
      });
  
      currentY += depositSize.height + 20;
  
      // 이전 상태의 보유 자산 노드들
      for (const [symbol, quantity] of Object.entries(history.previousState.holdings)) {
        const currentPrice = await getCurrentPrice(symbol);
        const nodeSize = await calculateNodeSize({
          id: `${symbol}-${index}-before`,
          date: history.date,
          amount: quantity,
          asset_symbol: symbol,
          position: { x_position: 0, y_position: 0 },
          type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
          action: 'buy',
          state: 'before'
        }, maxAssetValue);
  
        beforeNodes.push({
          id: `${symbol}-${index}-before`,
          date: history.date,
          amount: quantity,
          asset_symbol: symbol,
          position: {
            x_position: leftMargin,
            y_position: currentY
          },
          type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
          action: 'buy',
          state: 'before',
          size: nodeSize,
          value: currentPrice * quantity
        });
  
        currentY += nodeSize.height + 20;
      }
    }
  
    // 현재 상태(오른쪽) 노드 생성
    let currentY = 50;
  
    // 현재 상태 Deposit 노드
    const currentDepositSize = await calculateNodeSize({
      id: `DEPOSIT-${index}-after`,
      date: history.date,
      amount: history.state.cash,
      asset_symbol: 'DEPOSIT',
      position: { x_position: 0, y_position: 0 },
      type: 'deposit',
      action: 'buy',
      state: 'after'
    }, maxAssetValue);
  
    afterNodes.push({
      id: `DEPOSIT-${index}-after`,
      date: history.date,
      amount: history.state.cash,
      asset_symbol: 'DEPOSIT',
      position: {
        x_position: rightMargin,
        y_position: currentY
      },
      type: 'deposit',
      action: 'buy',
      state: 'after',
      size: currentDepositSize,
      value: history.state.cash
    });
  
    currentY += currentDepositSize.height + 20;
  
    // 현재 상태의 보유 자산 노드들
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
      const currentPrice = await getCurrentPrice(symbol);
      const nodeSize = await calculateNodeSize({
        id: `${symbol}-${index}-after`,
        date: history.date,
        amount: quantity,
        asset_symbol: symbol,
        position: { x_position: 0, y_position: 0 },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'buy',
        state: 'after'
      }, maxAssetValue);
  
      afterNodes.push({
        id: `${symbol}-${index}-after`,
        date: history.date,
        amount: quantity,
        asset_symbol: symbol,
        position: {
          x_position: rightMargin,
          y_position: currentY
        },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'buy',
        state: 'after',
        size: nodeSize,
        value: currentPrice * quantity
      });
  
      currentY += nodeSize.height + 20;
    }
  
    const maxNodesHeight = Math.max(
      beforeNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0),
      afterNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0)
    );
  
    return {
      date: history.date,
      position: {
        x_position: blockXPosition,
        width: blockWidth,
        height: Math.max(maxNodesHeight + 50, blockHeight)
      },
      beforeNodes,
      afterNodes
    };
  };

  const CustomFlowChart = ({ transactions }: { transactions: Transaction[] }) => {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
  
    useEffect(() => {
      const initializeBlocks = async () => {
        const assetHistory = trackAssets(transactions);
        const newBlocks: BlockType[] = [];
        const newEdges: Edge[] = [];
  
        for (let index = 0; index < assetHistory.length; index++) {
          const history = assetHistory[index];
          const previousBlock = index > 0 ? newBlocks[index - 1] : undefined;
          const block = await createBlock(history, index, previousBlock);
          newBlocks.push(block);
  
          // 블록 간 연속성 엣지 생성
          if (previousBlock) {
            block.beforeNodes.forEach(currentNode => {
              const previousNode = previousBlock.afterNodes.find(
                n => n.asset_symbol === currentNode.asset_symbol
              );
              if (previousNode) {
                newEdges.push({
                  id: `continuity-${index}-${currentNode.asset_symbol}`,
                  source: previousNode.id,
                  target: currentNode.id,
                  type: 'buy'
                });
              }
            });
          }
  
          // 블록 내 거래 엣지 생성
          const currentTransaction = transactions.find(
            t => t.transaction_date === history.date
          );
  
          if (currentTransaction?.transaction_type === 'buy') {
            const sourceNode = block.beforeNodes.find(n => n.asset_symbol === 'DEPOSIT');
            const targetNode = block.afterNodes.find(
              n => n.asset_symbol === currentTransaction.asset_symbol
            );
            
            if (sourceNode && targetNode) {
              newEdges.push({
                id: `trade-${index}-${currentTransaction.asset_symbol}`,
                source: sourceNode.id,
                target: targetNode.id,
                type: 'buy'
              });
            }
          } else if (currentTransaction?.transaction_type === 'sell') {
            const sourceNode = block.beforeNodes.find(
              n => n.asset_symbol === currentTransaction.asset_symbol
            );
            const targetNode = block.afterNodes.find(n => n.asset_symbol === 'DEPOSIT');
            
            if (sourceNode && targetNode) {
              newEdges.push({
                id: `trade-${index}-${currentTransaction.asset_symbol}`,
                source: sourceNode.id,
                target: targetNode.id,
                type: 'sell'
              });
            }
          }
  
          // 블록 내 연속성 엣지 생성
          block.beforeNodes.forEach(beforeNode => {
            const afterNode = block.afterNodes.find(
              n => n.asset_symbol === beforeNode.asset_symbol
            );
            if (afterNode && !currentTransaction?.asset_symbol?.includes(beforeNode.asset_symbol)) {
              newEdges.push({
                id: `internal-${index}-${beforeNode.asset_symbol}`,
                source: beforeNode.id,
                target: afterNode.id,
                type: 'buy'
              });
            }
          });
        }
  
        setBlocks(newBlocks);
        setEdges(newEdges);
      };
  
      initializeBlocks();
    }, [transactions]);
  
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
      const label = `${node.asset_symbol}\n${node.amount}주\n₩${node.value?.toLocaleString() ?? '0'}`;
  
      return (
        <g transform={`translate(${node.position.x_position},${node.position.y_position})`}>
          <rect
            width={node.size.width}
            height={node.size.height}
            rx="5"
            ry="5"
            fill={backgroundColor}
            stroke="#1a192b"
            strokeWidth="1"
          />
          {label.split('\n').map((line, i) => (
            <text
              key={i}
              x={node.size.width / 2}
              y={node.size.height / 2 + (i - 1) * 15}
              textAnchor="middle"
              fontSize="12"
            >
              {line}
            </text>
          ))}
        </g>
      );
    };
  
    const Edge = ({ edge }: { edge: Edge }) => {
      const sourceNode = blocks.flatMap(b => [...b.beforeNodes, ...b.afterNodes])
        .find(n => n.id === edge.source);
      const targetNode = blocks.flatMap(b => [...b.beforeNodes, ...b.afterNodes])
        .find(n => n.id === edge.target);
  
      if (!sourceNode || !targetNode) return null;
  
      const startX = sourceNode.position.x_position + sourceNode.size.width;
      const startY = sourceNode.position.y_position + sourceNode.size.height / 2;
      const endX = targetNode.position.x_position;
      const endY = targetNode.position.y_position + targetNode.size.height / 2;
  
      const isInterBlockEdge = sourceNode.state === 'after' && targetNode.state === 'before';
      const path = isInterBlockEdge
        ? `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`
        : `M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2} ${endX} ${endY}`;
  
      return (
        <path
          d={path}
          stroke={edge.type === 'buy' ? 'green' : 'red'}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrow-${edge.type})`}
        />
      );
    };
  
    return (
      <div style={{ overflowX: 'auto' }}>
        <svg width={Math.max(1000, blocks.length * 350)} height={800}>
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
          
          {blocks.map((block) => (
            <Block key={block.date} block={block}>
              {block.beforeNodes.map(node => (
                <Node key={node.id} node={node} />
              ))}
              {block.afterNodes.map(node => (
                <Node key={node.id} node={node} />
              ))}
            </Block>
          ))}
  
          {edges.map(edge => (
            <Edge key={edge.id} edge={edge} />
          ))}
        </svg>
      </div>
    );
  };
  
  export default CustomFlowChart;