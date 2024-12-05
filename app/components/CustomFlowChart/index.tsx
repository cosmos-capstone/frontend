// components/CustomFlowChart/index.tsx
'use client';
import { useEffect, useState } from 'react';
import { Block as BlockType, Edge as EdgeType } from '../../types/types';
import { trackAssets } from '../../utils/assetTracker';
import { createBlock } from '../../utils/blockCalculator';
import { Block } from './Block';
import { Node } from './Node';
import { Edge } from './Edge';
import { HoverInfo } from './HoverInfo';
import { CustomFlowChartProps } from './types'; 
import {extractIndexFromString} from '@/app/utils/extractIndexFromString';
 
export const CustomFlowChart = ({ transactions ,setCurrentEditIndex}: CustomFlowChartProps) => {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [edges, setEdges] = useState<EdgeType[]>([]);
    const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
    // const [hoveredNode] = useState<Node | null>(null);
    
    

    useEffect(() => {
        const initializeBlocks = async () => {
            const assetHistory = trackAssets(transactions);
            const newBlocks: BlockType[] = [];
            const newEdges: EdgeType[] = [];

            // 블록 생성
            for (let index = 0; index < assetHistory.length; index++) {
                const history = assetHistory[index];
                const previousBlock = index > 0 ? newBlocks[index - 1] : undefined;
                const block = await createBlock(history, index, previousBlock, transactions);
                newBlocks.push(block);
            }

            // 엣지 생성
            for (let index = 0; index < newBlocks.length; index++) {
                const currentBlock = newBlocks[index];
                const previousBlock = index > 0 ? newBlocks[index - 1] : undefined;

                // 1. 블록 간 연속성 엣지
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
                            console.log(`iiiAdding Edge: source=${prevNode.id}, target=${currentNode?.id}, symbol=${prevNode.asset_symbol}, index=${index}`);

                        }
                    });
                    
                    console.log("fffindex nodes")
                   
                    
                }
               

                // 2. 블록 내 거래 엣지
                const currentTransaction = transactions.find(
                    t => t.transaction_date === currentBlock.date
                );

                if (currentTransaction?.transaction_type === 'buy') {
                    // 매수 엣지
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
                    // 매도 엣지 - 분할된 노드 처리
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

                    // 유지되는 부분 엣지
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

                // 3. 변화 없는 자산들의 연속성 엣지
                // 블록 내 연속성 엣지 생성 부분 수정
                currentBlock.beforeNodes.forEach(beforeNode => {
                    const afterNode = currentBlock.afterNodes.find(
                        n => n.asset_symbol === beforeNode.asset_symbol
                    );

                    if (afterNode) {
                        // 현재 거래가 이 자산의 매수거래인 경우
                        if (currentTransaction?.transaction_type === 'buy' &&
                            currentTransaction.asset_symbol === beforeNode.asset_symbol) {
                            // 기존 보유 자산에서 새로운 보유량으로의 연결
                            newEdges.push({
                                id: `internal-continuity-${index}-${beforeNode.asset_symbol}`,
                                source: beforeNode.id,
                                target: afterNode.id,
                                type: 'buy'
                            });
                        }
                        // 현재 거래가 이 자산의 매도거래인 경우
                        else if (currentTransaction?.transaction_type === 'sell' &&
                            currentTransaction.asset_symbol === beforeNode.asset_symbol) {
                            // 매도 후에도 자산이 남아있는 경우에만 연결
                            if (afterNode.amount > 0) {
                                newEdges.push({
                                    id: `internal-continuity-${index}-${beforeNode.asset_symbol}`,
                                    source: beforeNode.id,
                                    target: afterNode.id,
                                    type: 'buy'
                                });
                            }
                        }
                        // 현재 거래가 다른 자산의 거래인 경우 (영향 받지 않는 자산)
                        else if (currentTransaction?.asset_symbol !== beforeNode.asset_symbol) {
                            newEdges.push({
                                id: `internal-continuity-${index}-${beforeNode.asset_symbol}`,
                                source: beforeNode.id,
                                target: afterNode.id,
                                type: 'buy'
                            });
                        }
                    }
                });
            }

            setBlocks(newBlocks);
            setEdges(newEdges);
            newEdges.forEach((edge) => {
                console.log(`gggEdge ID: ${edge.id}, Source: ${edge.source}, Target: ${edge.target}, Type: ${edge.type}`);
            });
        };

        initializeBlocks();
    }, [transactions]);


    const handleNodeClick = (node) => {
        
        setCurrentEditIndex(extractIndexFromString(node.id));
        console.log("kkkkNode has been clicked - node id : ",extractIndexFromString(node.id));
        
    };

    return (
        <div style={{
            overflowX: 'auto',
            overflowY: 'auto',
            height: '400px', // 원하는 높이로 조정하세요
            maxHeight: '80vh', // 뷰포트 높이의 80%로 제한 (선택적)
        }}>
            <svg
                width={Math.max(1500, blocks.length * 200)}
                height={400}
                className="flow-chart"
            >
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
                    <Edge key={edge.id} edge={edge} blocks={blocks} />
                ))}
                {blocks.map((block, index) => (
                    <Block key={`${block.date.toISOString()}-${index}`} block={block}>
                        {block.beforeNodes.map(node => (
                            <Node
                                key={node.id}
                                node={node}
                                onHover={setHoveredNode}
                                onClick={() => handleNodeClick(node)} // 클릭 핸들러 추가
                            />
                        ))}
                        {block.afterNodes.map(node => (
                            <Node
                                key={node.id}
                                node={node}
                                onHover={setHoveredNode}
                                onClick={() => handleNodeClick(node)} // 클릭 핸들러 추가
                            />
                        ))}
                        
                    </Block>
                ))}

                
                {hoveredNode && <HoverInfo node={hoveredNode} />}
            </svg>
        </div>
    );
};

export default CustomFlowChart;