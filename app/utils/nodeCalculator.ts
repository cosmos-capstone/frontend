// utils/nodeCalculator.ts
import { Node, Block } from '../types/types';
import { NodeSize } from '../components/CustomFlowChart/types';

import { nodeBaseWidth, nodeBaseHeight } from '../constants/globalConfig';
import {getStockPrice} from '@/app/utils/api'

export const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
): Promise<NodeSize> => {
    const assetValue = await calculateAssetValue({
        symbol: node.asset_symbol,
        quantity:node.amount,
        date: node.date, 
        type :node.type});

    const minHeight = 10;
    const calculatedHeight = (assetValue / maxAssetValue) * nodeBaseHeight;
    const height = Math.max(calculatedHeight, minHeight);

    return {
        width: nodeBaseWidth,
        height,
    };
};

export const calculateAssetValue = async ({
    symbol,
    quantity,
    date,
    type
}: {
    symbol: string,
    quantity: number,
    date: Date,
    type: 'deposit' | 'american_stock' | 'korean_stock'
}): Promise<number> => {
    if (type === 'deposit') {
        return quantity;
    }

    const price = await getStockPrice(symbol, date);
    
    if (price === null) {
        console.error(`dddFailed to get price for ${symbol} on ${date}`);
        console.log(`dddAsset value set to 0 due to null price for ${symbol}`);
        return 0;
    }

    console.log(`dddProcessing ${symbol} (${type}) on ${date}`);
    console.log(`dddPrice: ${price}, Amount: ${quantity}`);

    let assetValue: number;
    if (type === 'american_stock') {
        assetValue = price * quantity * 1400;
        console.log(`dddAmerican stock: ${price} * ${quantity} * 1400 = ${assetValue}`);
    } else if (type === 'korean_stock') {
        assetValue = price * quantity;
        console.log(`dddKorean stock: ${price} * ${quantity} = ${assetValue}`);
    } else {
        console.error(`Unknown asset type: ${type}`);
        assetValue = 0;
        console.log(`dddAsset value set to 0 due to unknown type for ${symbol}`);
    }

    console.log(`dddFinal asset value for ${symbol}: ${assetValue}`);
    return assetValue;
}
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