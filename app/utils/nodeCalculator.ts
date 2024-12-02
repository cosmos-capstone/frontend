// utils/nodeCalculator.ts
import { Node, Block } from '../types/types';
import { NodeSize } from '../components/CustomFlowChart/types';
import { getCurrentPrice } from './priceAPI';
import { nodeBaseWidth, nodeBaseHeight } from '../constants/globalConfig';
import {getStockPrice} from '@/app/utils/api'

export const calculateNodeSize = async (
    node: Omit<Node, 'size'>,
    maxAssetValue: number
): Promise<NodeSize> => {
    let assetValue: number;

    if (node.type === 'deposit') {
        assetValue = node.amount;
    } else {
        
        const price = await getStockPrice(node.asset_symbol, node.date);
        
        if (price === null) {
            console.error(`dddFailed to get price for ${node.asset_symbol} on ${node.date}`);
            assetValue = 0;
            console.log(`dddAsset value set to 0 due to null price for ${node.asset_symbol}`);
        } else {
            console.log(`dddProcessing ${node.asset_symbol} (${node.type}) on ${node.date}`);
            console.log(`dddPrice: ${price}, Amount: ${node.amount}`);
        
            if (node.type === 'american_stock') {
                assetValue = price * node.amount * 1400;
                console.log(`dddAmerican stock: ${price} * ${node.amount} * 1400 = ${assetValue}`);// 수정 임시 환율 반영해야함
            } else if (node.type === 'korean_stock') {
                assetValue = price * node.amount;
                console.log(`dddKorean stock: ${price} * ${node.amount} = ${assetValue}`);
            } else {
                console.error(`Unknown asset type: ${node.type}`);
                assetValue = 0;
                console.log(`dddAsset value set to 0 due to unknown type for ${node.asset_symbol}`);
            }
        
            console.log(`dddFinal asset value for ${node.asset_symbol}: ${assetValue}`);
        }
    }

    // 최소 높이 설정 (예: 10px)
    const minHeight = 10; // 수정 가격 정보를 가져오지 못한 경우 예외처리 필요 가격 정보를 가져오지 못한 경우 무조건 10으로 되도록 되어 있다
    const calculatedHeight = (assetValue / maxAssetValue) * nodeBaseHeight;
    const height = Math.max(calculatedHeight, minHeight);

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