
// components/Block.tsx
export const Block = ({ block, children }: { block: Block; children: React.ReactNode }) => {
    return (
      <g transform={`translate(${block.position.x_position},0)`}>
        <rect
          width={block.position.width}
          height={block.position.height}
          fill="none"
          stroke="#ddd"
          strokeWidth="1"
        />
        {/* 블록 제목 (날짜) */}
        <text x={block.position.width / 2} y={30} 
              fontSize="14" textAnchor="middle" fontWeight="bold">
          {new Date(block.date).toLocaleDateString()}
        </text>
        {/* 구분선 */}
        <line
          x1={block.position.width / 2}
          y1={40}
          x2={block.position.width / 2}
          y2={block.position.height}
          stroke="#ddd"
          strokeDasharray="4"
        />
        {/* 거래 전/후 라벨 */}
        <text x={60} y={50} fontSize="12" textAnchor="middle">
          거래 전
        </text>
        <text x={block.position.width - 60} y={50} fontSize="12" textAnchor="middle">
          거래 후
        </text>
        {children}
      </g>
    );
  };