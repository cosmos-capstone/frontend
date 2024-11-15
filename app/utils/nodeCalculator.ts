// utils/nodeCalculator.ts
import { Node, Block } from '../types/types';
import { NodeSize } from '../components/CustomFlowChart/types';
import { getCurrentPrice } from './priceAPI';
import { nodeBaseWidth, nodeBaseHeight } from '../constants/globalConfig';

export const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
): Promise<NodeSize> => {
    let assetValue: number;

    if (node.type === 'deposit') {
        assetValue = node.amount;
    } else {
        const currentPrice = await getCurrentPrice(node.asset_symbol);
        assetValue = currentPrice * node.amount;
    }

    const height = (assetValue / maxAssetValue) * nodeBaseHeight;

    return {
        width: nodeBaseWidth,
        height,
    };
};

export const calculateNodePosition = (
    assetSymbol: string,
    previousBlock?: Block,
    state: 'before' | 'after' = 'before'
) => {
    const defaultYPosition = 100;
    const yGap = 0;

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