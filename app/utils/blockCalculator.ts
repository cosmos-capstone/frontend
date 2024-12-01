// utils/blockCalculator.ts
import { Block, AssetHistory, Node } from '../types/types';
import { calculateNodeSize } from './nodeCalculator';
import { getCurrentPrice } from './priceAPI';
import { BLOCK_CONFIG,nodeBaseWidth } from '../constants/globalConfig';
import { Transaction } from '../types/transaction';
import { blockWidthCalculate,MIN_BLOCK_WIDTH,calculateTimeDifference,calculateBlockWidth } from '@/app/utils/calculateBlockWidth';

type PreviousNodePositions = { [symbol: string]: number };


async function calculateMaxAssetValue(history: AssetHistory): Promise<number> {
    let maxValue = history.state.cash;
    if (history.previousState) {
        maxValue = Math.max(maxValue, history.previousState.cash);
        for (const [symbol, quantity] of Object.entries(history.previousState.holdings)) {
            const price = await getCurrentPrice(symbol);
            maxValue = Math.max(maxValue, price * quantity);
        }
    }
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
        const price = await getCurrentPrice(symbol);
        maxValue = Math.max(maxValue, price * quantity);
    }
    return maxValue;
}

async function createSellNodes(
    nodes: Node[],
    currentY: number,
    index: number,
    symbol: string,
    totalQuantity: number,
    transaction: Transaction,
    currentPrice: number,
    maxAssetValue: number
): Promise<void> {
    // 매도되는 수량에 대한 노드
    const sellQuantity = transaction.quantity;
    const sellNodeSize = await calculateNodeSize({
        id: `${symbol}-${index}-before-sell`,
        date: transaction.transaction_date,
        amount: sellQuantity,
        asset_symbol: symbol,
        position: { x_position: 0, y_position: 0 },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'sell',
        state: 'before'
    }, maxAssetValue);

    nodes.push({
        id: `${symbol}-${index}-before-sell`,
        date: transaction.transaction_date,
        amount: sellQuantity,
        asset_symbol: symbol,
        position: {
            x_position: BLOCK_CONFIG.leftMargin,
            y_position: currentY
        },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'sell',
        state: 'before',
        size: sellNodeSize,
        value: currentPrice * sellQuantity
    });

    // 유지되는 수량에 대한 노드
    const remainingQuantity = totalQuantity - sellQuantity;
    if (remainingQuantity > 0) {
        const holdNodeSize = await calculateNodeSize({
            id: `${symbol}-${index}-before-hold`,
            date: transaction.transaction_date,
            amount: remainingQuantity,
            asset_symbol: symbol,
            position: { x_position: 0, y_position: 0 },
            type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
            action: 'buy',
            state: 'before'
        }, maxAssetValue);

        nodes.push({
            id: `${symbol}-${index}-before-hold`,
            date: transaction.transaction_date,
            amount: remainingQuantity,
            asset_symbol: symbol,
            position: {
                x_position: BLOCK_CONFIG.leftMargin,
                y_position: currentY + sellNodeSize.height + 20
            },
            type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
            action: 'buy',
            state: 'before',
            size: holdNodeSize,
            value: currentPrice * remainingQuantity
        });
    }
}

async function createNormalNode( // only after node need a block width so if it is a after node blockWidth value will be passed 
    nodes: Node[],
    currentY: number,
    index: number,
    symbol: string,
    quantity: number,
    maxAssetValue: number,
    date:Date,
    state: 'before' | 'after',

    blockWidth?:number,
    
): Promise<void> {
    const currentPrice = await getCurrentPrice(symbol);
    const nodeSize = await calculateNodeSize({
        id: `${symbol}-${index}-${state}`,
        date: date,  // Will be set in the node creation
        amount: quantity,
        asset_symbol: symbol,
        position: { x_position: 0, y_position: 0 },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'buy',
        state: state
    }, maxAssetValue);
    

    nodes.push({
        id: `${symbol}-${index}-${state}`,
        date: date,  // Will be set when used
        amount: quantity,
        asset_symbol: symbol,
        position: {
            x_position: state === 'before' ? BLOCK_CONFIG.leftMargin : blockWidth-nodeBaseWidth,
            y_position: currentY
        },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'buy',
        state: state,
        size: nodeSize,
        value: currentPrice * quantity
    });
}

async function createBeforeNodes(
    history: AssetHistory,
    maxAssetValue: number,
    index: number,
    currentTransaction?: Transaction,
    previousBlock?: Block,
    previousNodePositions?: PreviousNodePositions,
): Promise<Node[]> {
    const nodes: Node[] = [];
    let currentY = 50;

    if (!history.previousState) return nodes;

    // Deposit node
    const depositY = previousNodePositions?.['DEPOSIT'] || currentY;
    const depositSize = await calculateNodeSize({
        id: `DEPOSIT-${index}-before`,
        date: history.date,
        amount: history.previousState.cash,
        asset_symbol: 'DEPOSIT',
        position: { x_position: 0, y_position: 0 },
        type: 'deposit',
        action: 'buy',
        state: 'before'
    }, maxAssetValue);

    nodes.push({
        id: `DEPOSIT-${index}-before`,
        date: history.date,
        amount: history.previousState.cash,
        asset_symbol: 'DEPOSIT',
        position: {
            x_position: BLOCK_CONFIG.leftMargin,
            y_position: depositY
        },
        type: 'deposit',
        action: 'buy',
        state: 'before',
        size: depositSize,
        value: history.previousState.cash
    });

    currentY += depositSize.height + 20;

    // Asset nodes
    for (const [symbol, quantity] of Object.entries(history.previousState.holdings)) {
        const symbolY = previousNodePositions?.[symbol] || currentY;
        
        if (currentTransaction?.transaction_type === 'sell' && 
            symbol === currentTransaction.asset_symbol) {
            const currentPrice = await getCurrentPrice(symbol);
            await createSellNodes(
                nodes, symbolY, index, symbol, quantity, 
                currentTransaction, currentPrice, maxAssetValue
            );
            currentY = symbolY + nodes[nodes.length - 1].size.height + 20;
            // currentY = symbolY + (nodes[nodes.length - 1].size.height + 20) * 
            // (quantity - currentTransaction.quantity > 0 ? 2 : 1);
           
        } else {
            await createNormalNode(
                nodes, symbolY, index, symbol, quantity, maxAssetValue,history.date, 'before'
            );
            currentY = symbolY + nodes[nodes.length - 1].size.height + 20;
        }
    }

    return nodes;
}

async function createAfterNodes(
    history: AssetHistory,
    maxAssetValue: number,
    index: number,
    previousBlock?: Block,
    previousNodePositions?: PreviousNodePositions
): Promise<Node[]> {
    const nodes: Node[] = [];
    let currentY = 50;
    
    const blockWidth = previousBlock ? blockWidthCalculate(previousBlock.date, history.date) : MIN_BLOCK_WIDTH;
    const depositY = previousNodePositions?.['DEPOSIT'] || currentY;
    // Deposit node
    const depositSize = await calculateNodeSize({
        id: `DEPOSIT-${index}-after`,
        date: history.date,
        amount: history.state.cash,
        asset_symbol: 'DEPOSIT',
        position: { x_position: 0, y_position: 0 },
        type: 'deposit',
        action: 'buy',
        state: 'after'
    }, maxAssetValue);

    nodes.push({
        id: `DEPOSIT-${index}-after`,
        date: history.date,
        amount: history.state.cash,
        asset_symbol: 'DEPOSIT',
        position: {
            x_position: blockWidth-10,
            // x_position: BLOCK_CONFIG.rightMargin,
            y_position: depositY
        },
        type: 'deposit',
        action: 'buy',
        state: 'after',
        size: depositSize,
        value: history.state.cash
    });

    currentY = depositY + depositSize.height + 20;


    // Asset nodes
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
        const symbolY = previousNodePositions?.[symbol] || currentY;
        await createNormalNode(
            nodes, symbolY, index, symbol, quantity, maxAssetValue, history.date, 'after', blockWidth
        );
        currentY = symbolY + nodes[nodes.length - 1].size.height + 20;
    }

    return nodes;
}

export async function createBlock(
    history: AssetHistory,
    index: number,
    previousBlock?: Block,
    transactions?: Transaction[]
): Promise<Block> {
    const currentTransaction = transactions?.find(
        t => t.transaction_date === history.date
    );
    const previousNodePositions: PreviousNodePositions = {};
    if (previousBlock) {
        previousBlock.afterNodes.forEach(node => {
            // previousNodePositions[node.asset_symbol] = node.position.y_position;
            previousNodePositions[node.asset_symbol] = node.amount;
        });
        console.log(`Block ${index} - Previous Node Positions:`, previousNodePositions);
    }
    else {
        console.log(`Block ${index} - No previous block`);
    }

    const maxAssetValue = 4999999; // 수정 임시 목업
    // const maxAssetValue = await calculateMaxAssetValue(history);
    const beforeNodes = await createBeforeNodes(history, maxAssetValue, index, currentTransaction,previousBlock,previousNodePositions);
    const afterNodes = await createAfterNodes(history, maxAssetValue, index, previousBlock);
    console.log(`Block ${index} - Created Node Positions:`);
    console.log('Before Nodes:', beforeNodes.map(node => ({ symbol: node.asset_symbol, y: node.position.y_position })));
    console.log('After Nodes:', afterNodes.map(node => ({ symbol: node.asset_symbol, y: node.position.y_position })));

    
    
    
    const maxNodesHeight = Math.max(
        beforeNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0),
        afterNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0)
    );
    // const timeDifference = previousBlock 
    //     ? calculateTimeDifference(previousBlock.date, history.date)
    //     : 0;
    // const blockWidth = calculateBlockWidth(timeDifference);

    const blockWidth = previousBlock ? blockWidthCalculate(previousBlock.date, history.date) : MIN_BLOCK_WIDTH;
    
    return {
        date: history.date,
        position: {
            x_position: previousBlock 
                ? previousBlock.position.x_position + previousBlock.position.width + BLOCK_CONFIG.gap
                : 0,
                // x_position: index * (BLOCK_CONFIG.width + BLOCK_CONFIG.gap),
                // width: BLOCK_CONFIG.width,
            width: blockWidth,
            height: Math.max(maxNodesHeight + 50, BLOCK_CONFIG.minHeight)
        },
        beforeNodes,
        afterNodes
    };
}