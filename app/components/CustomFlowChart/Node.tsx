// components/CustomFlowChart/Node.tsx
import { useState } from 'react';
import { NodeProps } from './types';
import { ASSET_COLORS } from '../../constants/assetColors';

export const Node = ({ node }: NodeProps) => {
    const [isHovered, setIsHovered] = useState(false);

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
    const simpleLabel = `${node.asset_symbol}`;
    const detailLabel = `${node.asset_symbol}\n${node.amount}주\n₩${node.value?.toLocaleString() ?? '0'}\n${node.date}`;
    const showLabel = node.state === 'before';

    return (
        <g
            transform={`translate(${node.position.x_position},${node.position.y_position})`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                    fontSize="12"
                    dy=".3em"
                >
                    {simpleLabel}
                </text>
            )}
            {/* 호버 시 표시되는 상세 정보 */}
            {isHovered && (
                <g transform={`translate(${node.size.width + 10}, ${-10})`}>
                    <rect
                        width={150}
                        height={80}
                        fill={backgroundColor}
                        stroke="#1a192b"
                        strokeWidth="1"
                        rx="5"
                        ry="5"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', // 불투명하게 하얗게 변경
                        }}
                    />
                    {detailLabel.split('\n').map((line, i) => (
                        <text
                            key={i}
                            x={75}
                            y={20 + i * 20}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#000"
                        >
                            {line}
                        </text>
                    ))}
                </g>
            )}
        </g>
    );
};