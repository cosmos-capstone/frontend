// components/CustomFlowChart/types.ts
import { Node, Edge, Block } from '../../types/types';
import { Transaction } from '@/app/types/transaction';
import {
    SetStateAction,
    Dispatch } from "react";

export interface NodeSize {
    width: number;
    height: number;
}

export interface NodeProps {
    node: Node;
    
    onHover: (node: Node | null) => void;
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
    setCurrentEditIndex: Dispatch<SetStateAction<number>>; /
}