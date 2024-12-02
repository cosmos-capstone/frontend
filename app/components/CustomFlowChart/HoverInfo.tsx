import React from 'react';
import { ASSET_COLORS } from '../../constants/assetColors';

export const HoverInfo = ({ node }) => {
    const backgroundColor = ASSET_COLORS[node.asset_symbol] || '#ffffff';
    const detailLabel = `${node.asset_symbol}\n${node.amount}주\n₩${node.value?.toLocaleString() ?? '0'}\n${node.date.toLocaleDateString()}`;

    // 호버 정보 박스의 위치 계산
    const boxWidth = 150;
    const boxHeight = 80;
    const xPosition = node.position.x_position + node.size.width + 10;
    const yPosition = node.position.y_position - boxHeight / 2 + node.size.height / 2;

    return (
        <g transform={`translate(${xPosition}, ${yPosition})`}>
            <rect
                width={boxWidth}
                height={boxHeight}
                fill={backgroundColor}
                stroke="#1a192b"
                strokeWidth="1"
                rx="5"
                ry="5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
            />
            {detailLabel.split('\n').map((line, i) => (
                <text
                    key={i}
                    x={boxWidth / 2}
                    y={20 + i * 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#000"
                >
                    {line}
                </text>
            ))}
        </g>
    );
};