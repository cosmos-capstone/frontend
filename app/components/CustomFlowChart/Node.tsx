// components/CustomFlowChart/Node.tsx
// import { useState } from 'react';
import { NodeProps } from './types';
import { ASSET_COLORS } from '../../constants/assetColors';

export const Node = ({ node }: NodeProps) => {
    

    const getBackgroundColor = () => {
        return ASSET_COLORS[node.asset_symbol] || '#ffffff';
      };
    
      const backgroundColor = getBackgroundColor();

    // const getBackgroundColor = (type: string) => {
    //     switch (type) {
    //         case 'deposit': return '#e6f3ff';
    //         case 'american_stock': return '#f0fff0';
    //         case 'korean_stock': return '#fff0f0';
    //         default: return '#ffffff';
    //     }
    // };

    // const backgroundColor = getBackgroundColor(node.type);
    const simpleLabel = `${node.asset_symbol}\n${node.date.toLocaleDateString()}`;
    // const detailLabel = `${node.asset_symbol}\n${node.amount}주\n₩${node.value?.toLocaleString() ?? '0'}\n${node.date.toLocaleDateString()}`;
    // const showLabel = node.state === 'before'; // 수정 
    const showLabel = true;

    return (
        <>
            <g
            //     transform={`translate(${node.position.x_position},${node.position.y_position})`}
            //     onMouseEnter={() => onHover(node)}
            // onMouseLeave={() => onHover(null)}
            >
                {/* 기본 노드 */}
                <rect
                    width={node.size.width}
                    height={node.size.height}
                    fill={backgroundColor}
                    stroke="#1a192b"
                    strokeWidth="0.1"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                />
                <text
                    x={node.size.width / 2}
                    y={node.size.height / 2}
                    textAnchor="middle"
                    fontSize="12"
                    dy=".3em"
                >
                    
                </text>

                {showLabel && (
                    <text
                        x={node.size.width / 2}
                        y={node.size.height / 2}
                        textAnchor="middle"
                        fontSize="3"
                        dy=".3em"
                    >
                        {simpleLabel}
                    </text>
                )}
            </g>

        </>
    );
};