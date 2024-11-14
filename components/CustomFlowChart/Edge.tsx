// components/CustomFlowChart/Edge.tsx
import { EdgeProps } from './types';

export const Edge = ({ edge, blocks }: EdgeProps) => {
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

    const startX = sourceBlock.position.x_position + sourceNode.position.x_position + sourceNode.size.width;
    const startY = sourceNode.position.y_position;
    const startHeight = sourceNode.size.height;
    
    const endX = targetBlock.position.x_position + targetNode.position.x_position;
    const endY = targetNode.position.y_position;
    const endHeight = targetNode.size.height;

    const distance = endX - startX;
    const curvature = 0.5;
    const cp1x = startX + distance * curvature;
    const cp2x = endX - distance * curvature;

    const topPath = `
        M ${startX} ${startY}
        C ${cp1x} ${startY},
          ${cp2x} ${endY},
          ${endX} ${endY}
    `;

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
        </g>
    );
};