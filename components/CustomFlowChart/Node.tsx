// components/CustomFlowChart/Node.tsx
import { NodeProps } from './types';

export const Node = ({ node }: NodeProps) => {
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
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
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