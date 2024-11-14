// utils/nodeCalculator.ts
import { Node, NodeSize } from '../types/types';
import { getCurrentPrice } from './priceAPI';

export const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
): Promise<NodeSize> => {
    const baseWidth = 40;
    const baseHeight = 100;

    let assetValue: number;

    if (node.type === 'deposit') {
        assetValue = node.amount;
    } else {
        const currentPrice = await getCurrentPrice(node.asset_symbol);
        assetValue = currentPrice * node.amount;
    }

    const height = (assetValue / maxAssetValue) * baseHeight;

    return {
        width: baseWidth,
        height
    };
};

export const calculateNodePosition = (
    assetSymbol: string,
    previousBlock?: Block,
    state: 'before' | 'after' = 'before'
) => {
    const defaultYPosition = 100;
    const yGap = 80;

    if (previousBlock) {
        const nodes = state === 'before' ? previousBlock.afterNodes : previousBlock.beforeNodes;
        const existingNode = nodes.find(node => node.asset_symbol === assetSymbol);
        if (existingNode) {
            return existingNode.position.y_position;
        }
    }

    if (assetSymbol === 'DEPOSIT') return defaultYPosition;
    return defaultYPosition + (yGap * (previousBlock?.afterNodes.length || 1));
};