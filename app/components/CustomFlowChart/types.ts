// components/CustomFlowChart/types.ts
import { Node, Edge, Block, Transaction } from '../../types/types';

export interface NodeSize {
    width: number;
    height: number;
}

export interface NodeProps {
    node: Node;
}

export interface EdgeProps {
    edge: Edge;
    blocks: Block[];
}

export interface BlockProps {
    block: Block;
    children: React.ReactNode;
}

export interface CustomFlowChartProps {
    transactions: Transaction[];
}