// utils/blockCalculator.ts
import { Block, AssetHistory, Transaction, Node } from '../types/types';
import { calculateNodeSize } from './nodeCalculator';
import { getCurrentPrice } from './priceAPI';
import { BLOCK_CONFIG } from '../constants/globalConfig';



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

async function createNormalNode(
    nodes: Node[],
    currentY: number,
    index: number,
    symbol: string,
    quantity: number,
    maxAssetValue: number,
    state: 'before' | 'after'
): Promise<void> {
    const currentPrice = await getCurrentPrice(symbol);
    const nodeSize = await calculateNodeSize({
        id: `${symbol}-${index}-${state}`,
        date: '',  // Will be set in the node creation
        amount: quantity,
        asset_symbol: symbol,
        position: { x_position: 0, y_position: 0 },
        type: symbol.includes('.KS') ? 'korean_stock' : 'american_stock',
        action: 'buy',
        state: state
    }, maxAssetValue);

    nodes.push({
        id: `${symbol}-${index}-${state}`,
        date: '',  // Will be set when used
        amount: quantity,
        asset_symbol: symbol,
        position: {
            x_position: state === 'before' ? BLOCK_CONFIG.leftMargin : BLOCK_CONFIG.rightMargin,
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
    currentTransaction?: Transaction
): Promise<Node[]> {
    const nodes: Node[] = [];
    let currentY = 50;

    if (!history.previousState) return nodes;

    // Deposit node
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
            y_position: currentY
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
        if (currentTransaction?.transaction_type === 'sell' && 
            symbol === currentTransaction.asset_symbol) {
            const currentPrice = await getCurrentPrice(symbol);
            await createSellNodes(
                nodes, currentY, index, symbol, quantity, 
                currentTransaction, currentPrice, maxAssetValue
            );
            currentY += (nodes[nodes.length - 1].size.height + 20) * 
                       (quantity - currentTransaction.quantity > 0 ? 2 : 1);
        } else {
            await createNormalNode(
                nodes, currentY, index, symbol, quantity, maxAssetValue, 'before'
            );
            currentY += nodes[nodes.length - 1].size.height + 20;
        }
    }

    return nodes;
}

async function createAfterNodes(
    history: AssetHistory,
    maxAssetValue: number,
    index: number
): Promise<Node[]> {
    const nodes: Node[] = [];
    let currentY = 50;

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
            x_position: BLOCK_CONFIG.rightMargin,
            y_position: currentY
        },
        type: 'deposit',
        action: 'buy',
        state: 'after',
        size: depositSize,
        value: history.state.cash
    });

    currentY += depositSize.height + 20;

    // Asset nodes
    for (const [symbol, quantity] of Object.entries(history.state.holdings)) {
        await createNormalNode(
            nodes, currentY, index, symbol, quantity, maxAssetValue, 'after'
        );
        currentY += nodes[nodes.length - 1].size.height + 20;
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
    
    const maxAssetValue = await calculateMaxAssetValue(history);
    const beforeNodes = await createBeforeNodes(history, maxAssetValue, index, currentTransaction);
    const afterNodes = await createAfterNodes(history, maxAssetValue, index);

    const maxNodesHeight = Math.max(
        beforeNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0),
        afterNodes.reduce((max, node) => Math.max(max, node.position.y_position + node.size.height), 0)
    );

    return {
        date: history.date,
        position: {
            x_position: index * (BLOCK_CONFIG.width + BLOCK_CONFIG.gap),
            width: BLOCK_CONFIG.width,
            height: Math.max(maxNodesHeight + 50, BLOCK_CONFIG.minHeight)
        },
        beforeNodes,
        afterNodes
    };
}