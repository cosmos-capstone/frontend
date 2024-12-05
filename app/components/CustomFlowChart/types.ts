// components/CustomFlowChart/types.ts
import { Edge, Block } from '../../types/types';
import { Node as modifyNode } from '@/app/types/types';
import { Transaction } from '@/app/types/transaction';
import {
    SetStateAction,
    Dispatch } from "react";

export interface NodeSize {
    width: number;
    height: number;
}

export interface NodeProps {
    node: modifyNode;
    onHover: Dispatch<SetStateAction<Node>>;
    onClick: Dispatch<SetStateAction<Node>>;
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
    setCurrentEditIndex: Dispatch<SetStateAction<number>>;
}