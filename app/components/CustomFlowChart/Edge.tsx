// components/CustomFlowChart/Edge.tsx
import { EdgeProps } from './types'; 
import { ASSET_COLORS } from '../../constants/assetColors';


export const Edge = ({ edge, blocks }: EdgeProps) => {
    const sourceNode = blocks.flatMap(b => [...b.beforeNodes, ...b.afterNodes])
        .find(n => n.id === edge.source);
    const targetNode = blocks.flatMap(b => [...b.beforeNodes, ...b.afterNodes])
        .find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;
    const sourceColor = ASSET_COLORS[sourceNode.asset_symbol] || '#000000';
    const targetColor = ASSET_COLORS[targetNode.asset_symbol] || '#000000';


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
    // const curvature = 0.5;   // unused variable error
    // const cp1x = startX + distance * curvature;  // unused variable error
    // const cp2x = endX - distance * curvature;    // unused variable error

    // const curveHeight = Math.max(startHeight, endHeight) * 0.5; // 곡선의 높이    // unused variable error

    // Log input values for debugging
    console.log(
        `gggSource Node: ${sourceNode.id}, gggTarget Node: ${targetNode}, gggStart X, Y: ${startX}, ${startY}, gggEnd X, Y: ${endX}, ${endY}, gggSource Color: ${sourceColor}, gggTarget Color: ${targetColor}`
      );
      



    const topPath = `
    M ${startX} ${startY}
    C ${startX + distance * 0.25} ${startY},
      ${endX - distance * 0.25} ${endY},
      ${endX} ${endY}
  `;
    const bottomPath = `
    L ${endX} ${endY + endHeight}
    C ${endX - distance * 0.25} ${endY + endHeight},
      ${startX + distance * 0.25} ${startY + startHeight},
      ${startX} ${startY + startHeight}
    Z
  `;
    // 거래 유형에 따른 그라데이션 색상 반환
    const getGradientColor = (baseColor: string, type: 'buy' | 'sell') => {
        if (type === 'buy') {
            return `rgba(${hexToRgb(baseColor).r}, ${hexToRgb(baseColor).g}, ${hexToRgb(baseColor).b}, 0.3)`;
        } else {
            return `rgba(${hexToRgb(baseColor).r}, ${hexToRgb(baseColor).b}, ${hexToRgb(baseColor).g}, 0.3)`;
        }
    };
    // 16진수 색상을 RGB로 변환
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

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
                            stopColor={getGradientColor(sourceColor, edge.type)}
                        />
                        <stop
                            offset="100%"
                            stopColor={getGradientColor(targetColor, edge.type)}
                        />
                </linearGradient>
            </defs>
            <path
                d={`${topPath} ${bottomPath}`}
                fill={`url(#gradient-${edge.id})`}
                stroke="none"
            >
                <defs>
                    <linearGradient
                        id={`gradient-${edge.id}`}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                    >

                        <stop
                            offset="0%"
                            stopColor={getGradientColor(sourceColor, edge.type)}
                        />
                        <stop
                            offset="100%"
                            stopColor={getGradientColor(targetColor, edge.type)}
                        />
                    </linearGradient>
                </defs>
            </path>
        </g>
    );
};