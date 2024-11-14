// components/CustomFlowChart.tsx
'use client';
import { useEffect, useState } from 'react';
import { trackAssets } from '../utils/assetTracker';
import { Block } from './Block';
import { Transaction, Node, Edge, Block as BlockType, AssetHistory } from '../types/types';
import { getCurrentPrice } from '../utils/priceAPI';

interface NodeSize {
    width: number;
    height: number;
}
interface NodeGroup {
    symbol: string;
    nodes: Node[];
    totalHeight: number;
    position: {
        x_position: number;
        y_position: number;
    };
}


const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
): Promise<NodeSize> => {
    const baseWidth = 120;
    const baseHeight = 200; // 기준 높이 설정

    let assetValue: number;

    if (node.type === 'deposit') {
        assetValue = node.amount;
    } else {
        const currentPrice = await getCurrentPrice(node.asset_symbol);
        assetValue = currentPrice * node.amount;
    }

    // 순수하게 자산 가치에 비례하여 높이 계산
    const height = (assetValue / maxAssetValue) * baseHeight;

    return {
        width: baseWidth,
        height: height
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
    previousBlock?: BlockType,
    transactions?: Transaction[]  // 거래 데이터 추가
): Promise<BlockType> => {
    const blockWidth = 400;  // 블록 너비는 유지
    const blockGap = 10;    // 블록 간 간격을 50에서 20으로 줄임
    const blockXPosition = index * (blockWidth + blockGap);  // 간격 적용
    const blockHeight = 500;
    const leftMargin = 50;
    const rightMargin = blockWidth - 170;


    const beforeNodes: Node[] = [];
    const afterNodes: Node[] = [];

    // 최대 자산 가치 계산
    let maxAssetValue = history.state.cash;
    if (history.previousState) {
        maxAssetValue = Math.max(maxAssetValue, history.previousState.cash);
        // 이전 상태의 주식 가치 계산
        for (const [symbol, quantity] of Object.entries(history.previousState.holdings)) {
            const price = await getCurrentPrice(symbol);
            const stockValue = price * quantity;
            maxAssetValue = Math.max(maxAssetValue, stockValue);
        }
    }
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
        const price = await getCurrentPrice(symbol);
        const stockValue = price * quantity;
        maxAssetValue = Math.max(maxAssetValue, stockValue);
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

            const currentTransaction = transactions?.find(t => t.transaction_date === history.date);

            if (currentTransaction?.transaction_type === 'sell' &&
                symbol === currentTransaction.asset_symbol) {
                // currentPrice 정의 추가
                const currentPrice = await getCurrentPrice(symbol);

                // 매도되는 수량에 대한 노드
                const sellQuantity = currentTransaction.quantity;
                const sellValue = currentPrice * sellQuantity;
                const sellNodeSize = await calculateNodeSize({
                    id: `${symbol}-${index}-before-sell`,
                    date: history.date,
                    amount: sellQuantity,
                    asset_symbol: symbol,
                    position: { x_position: 0, y_position: 0 },
                    type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
                    action: 'sell',
                    state: 'before'
                }, maxAssetValue);

                const remainingQuantity = quantity - sellQuantity;
                const remainingValue = currentPrice * remainingQuantity;

                

                beforeNodes.push({
                    id: `${symbol}-${index}-before-sell`,
                    date: history.date,
                    amount: sellQuantity,
                    asset_symbol: symbol,
                    position: {
                        x_position: leftMargin,
                        y_position: currentY
                    },
                    type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
                    action: 'sell',
                    state: 'before',
                    size: sellNodeSize,
                    value: currentPrice * sellQuantity
                });

                currentY += sellNodeSize.height + 20;

                // 유지되는 수량에 대한 노드
                if (remainingQuantity > 0) {
                    const holdNodeSize = await calculateNodeSize({
                        id: `${symbol}-${index}-before-hold`,
                        date: history.date,
                        amount: remainingQuantity,
                        asset_symbol: symbol,
                        position: { x_position: 0, y_position: 0 },
                        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
                        action: 'buy',
                        state: 'before'
                    }, maxAssetValue);

                    beforeNodes.push({
                        id: `${symbol}-${index}-before-hold`,
                        date: history.date,
                        amount: remainingQuantity,
                        asset_symbol: symbol,
                        position: {
                            x_position: leftMargin,
                            y_position: currentY
                        },
                        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
                        action: 'buy',
                        state: 'before',
                        size: holdNodeSize,
                        value: currentPrice * remainingQuantity
                    });

                    currentY += holdNodeSize.height + 20;
                }
            } else {
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
            height: Math.max(
                Math.max(
                    beforeNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0),
                    afterNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0)
                ) + 50,
                500
            )
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

            // 먼저 모든 블록 생성
            for (let index = 0; index < assetHistory.length; index++) {
                const history = assetHistory[index];
                const previousBlock = index > 0 ? newBlocks[index - 1] : undefined;
                // transactions 파라미터 추가
                const block = await createBlock(history, index, previousBlock, transactions);
                newBlocks.push(block);
            }

            // 블록이 모두 생성된 후 엣지 생성
            for (let index = 0; index < newBlocks.length; index++) {
                const currentBlock = newBlocks[index];
                const previousBlock = index > 0 ? newBlocks[index - 1] : undefined;

                // 1. 블록 간 연결 (이전 블록의 afterNodes와 현재 블록의 beforeNodes 연결)
                if (previousBlock) {
                    previousBlock.afterNodes.forEach(prevNode => {
                        const currentNode = currentBlock.beforeNodes.find(
                            n => n.asset_symbol === prevNode.asset_symbol
                        );
                        if (currentNode) {
                            newEdges.push({
                                id: `block-connection-${index}-${prevNode.asset_symbol}`,
                                source: prevNode.id,
                                target: currentNode.id,
                                type: 'buy'
                            });
                        }
                    });
                }

                // 2. 현재 블록 내 거래 처리
                const currentTransaction = transactions.find(
                    t => t.transaction_date === currentBlock.date
                );

                if (currentTransaction?.transaction_type === 'buy') {
                    const sourceNode = currentBlock.beforeNodes.find(n => n.asset_symbol === 'DEPOSIT');
                    const targetNode = currentBlock.afterNodes.find(
                        n => n.asset_symbol === currentTransaction.asset_symbol
                    );

                    if (sourceNode && targetNode) {
                        newEdges.push({
                            id: `trade-buy-${index}-${currentTransaction.asset_symbol}`,
                            source: sourceNode.id,
                            target: targetNode.id,
                            type: 'buy'
                        });
                    }
                } else if (currentTransaction?.transaction_type === 'sell') {
                    // 매도되는 부분의 노드
                    const sellSourceNode = currentBlock.beforeNodes.find(
                        n => n.asset_symbol === currentTransaction.asset_symbol && n.action === 'sell'
                    );
                    const depositTargetNode = currentBlock.afterNodes.find(
                        n => n.asset_symbol === 'DEPOSIT'
                    );

                    if (sellSourceNode && depositTargetNode) {
                        newEdges.push({
                            id: `trade-sell-${index}-${currentTransaction.asset_symbol}`,
                            source: sellSourceNode.id,
                            target: depositTargetNode.id,
                            type: 'sell'
                        });
                    }

                    // 유지되는 부분의 노드
                    const holdSourceNode = currentBlock.beforeNodes.find(
                        n => n.asset_symbol === currentTransaction.asset_symbol && n.action === 'buy'
                    );
                    const holdTargetNode = currentBlock.afterNodes.find(
                        n => n.asset_symbol === currentTransaction.asset_symbol
                    );

                    if (holdSourceNode && holdTargetNode) {
                        newEdges.push({
                            id: `hold-${index}-${currentTransaction.asset_symbol}`,
                            source: holdSourceNode.id,
                            target: holdTargetNode.id,
                            type: 'buy'
                        });
                    }
                }

                // 3. 블록 내 변화 없는 자산들의 연속성 표시
                currentBlock.beforeNodes.forEach(beforeNode => {
                    const afterNode = currentBlock.afterNodes.find(
                        n => n.asset_symbol === beforeNode.asset_symbol
                    );
                    if (afterNode &&
                        (!currentTransaction ||
                            currentTransaction.asset_symbol !== beforeNode.asset_symbol)) {
                        newEdges.push({
                            id: `internal-continuity-${index}-${beforeNode.asset_symbol}`,
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
            switch (type) {
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

        const sourceBlock = blocks.find(b =>
            [...b.beforeNodes, ...b.afterNodes].some(n => n.id === edge.source)
        );
        const targetBlock = blocks.find(b =>
            [...b.beforeNodes, ...b.afterNodes].some(n => n.id === edge.target)
        );

        if (!sourceBlock || !targetBlock) return null;

        // 소스와 타겟 노드의 좌표 및 크기 계산
        const startX = sourceBlock.position.x_position + sourceNode.position.x_position + sourceNode.size.width;
        const startY = sourceNode.position.y_position;
        const startHeight = sourceNode.size.height;

        const endX = targetBlock.position.x_position + targetNode.position.x_position;
        const endY = targetNode.position.y_position;
        const endHeight = targetNode.size.height;

        // 곡선의 강도 계산
        const distance = endX - startX;
        const curvature = 0.5;

        // 컨트롤 포인트 계산
        const cp1x = startX + distance * curvature;
        const cp2x = endX - distance * curvature;

        // 상단 경로
        const topPath = `
            M ${startX} ${startY}
            C ${cp1x} ${startY},
              ${cp2x} ${endY},
              ${endX} ${endY}
        `;

        // 하단 경로
        const bottomPath = `
            L ${endX} ${endY + endHeight}
            C ${cp2x} ${endY + endHeight},
              ${cp1x} ${startY + startHeight},
              ${startX} ${startY + startHeight}
            Z
        `;

        const gradientId = `gradient-${edge.id}`;

        return (
            <g>
                <defs>
                    <linearGradient
                        id={gradientId}
                        gradientUnits="userSpaceOnUse"
                        x1={startX}
                        y1={startY + startHeight / 2}
                        x2={endX}
                        y2={endY + endHeight / 2}
                    >
                        <stop
                            offset="0%"
                            stopColor={edge.type === 'buy' ? 'rgb(0, 200, 0)' : 'rgb(200, 0, 0)'}
                            stopOpacity="0.3"
                        />
                        <stop
                            offset="100%"
                            stopColor={edge.type === 'buy' ? 'rgb(0, 150, 0)' : 'rgb(150, 0, 0)'}
                            stopOpacity="0.3"
                        />
                    </linearGradient>
                </defs>
                <path
                    d={`${topPath} ${bottomPath}`}
                    fill={`url(#${gradientId})`}
                    stroke={edge.type === 'buy' ? 'rgba(0, 150, 0, 0.5)' : 'rgba(150, 0, 0, 0.5)'}
                    strokeWidth="1"
                    style={{
                        transition: 'all 0.3s ease',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                    }}
                />
                {/* 흐름 방향을 나타내는 패턴 */}
                <pattern
                    id={`flow-${edge.id}`}
                    width="15"
                    height="10"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="10"
                        stroke={edge.type === 'buy' ? 'rgba(0, 100, 0, 0.2)' : 'rgba(100, 0, 0, 0.2)'}
                        strokeWidth="8"
                    />
                </pattern>
            </g>
        );
    };
    return (
        <div style={{ overflowX: 'auto' }}>
            <svg width={Math.max(1000, blocks.length * (400 + 20))} height={800}>  {/* 너비 계산 수정 */}
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

                {/* 먼저 모든 블록과 노드를 렌더링 */}
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

                {/* 그 다음 모든 엣지를 렌더링 */}
                {edges.map(edge => (
                    <Edge key={edge.id} edge={edge} />
                ))}
            </svg>
        </div>
    );
};

export default CustomFlowChart;