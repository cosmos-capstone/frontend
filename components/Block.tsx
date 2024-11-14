// components/Block.tsx
export const Block = ({ block, children }: { block: BlockType; children: React.ReactNode }) => {
    return (
        <g transform={`translate(${block.position.x_position},0)`}>
            <rect
                width={block.position.width}
                height={block.position.height}
                fill="none"
                // stroke="#ddd"
                strokeWidth="1"
            />
            {/* 날짜 표시 */}
            <text
                x={block.position.width / 2}
                y={25}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
            >
                {new Date(block.date).toLocaleDateString()}
            </text>

            {/* 중앙 구분선 */}
            <line
                x1={block.position.width / 2}
                y1={40}
                x2={block.position.width / 2}
                y2={block.position.height}
                stroke="#ddd"
                strokeDasharray="4"
            />

            {/* Before/After 레이블 */}
            <text
                x={block.position.width * 0.25}
                y={25}
                textAnchor="middle"
                fontSize="12"
            >
                Before
            </text>
            <text
                x={block.position.width * 0.75}
                y={25}
                textAnchor="middle"
                fontSize="12"
            >
                After
            </text>

            {children}
        </g>
    );
};
