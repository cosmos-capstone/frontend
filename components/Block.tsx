
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
      <text x={10} y={30} fontSize="12">
        {new Date(block.date).toLocaleDateString()}
      </text>
      {children}
    </g>
  );
};