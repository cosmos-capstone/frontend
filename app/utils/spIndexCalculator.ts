// utils/spIndexCalculator.ts
import { Block,Node,AssetHistory } from '../types/types';
import { calculateNodeSize } from './nodeCalculator';
// import { BLOCK_CONFIG, nodeBaseWidth } from '../constants/globalConfig';
// import { blockWidthCalculate, MIN_BLOCK_WIDTH } from '@/app/utils/calculateBlockWidth';

export async function createIndicatorNodes(
    history: AssetHistory,
    maxAssetValue: number,
    index: number,
    state: 'before' | 'after',
    previousBlock?: Block,
    
): Promise<Node[]> {
    const nodes: Node[] = [];
    
    const indicatorSize = await calculateNodeSize({
        id: `INDICATOR-${index}-^GSPC`,
        
        date: state=='before' ? history.date : previousBlock.date,
        amount: 0.012,// 수정 가격에 맞춰서
        asset_symbol: '^GSPC',
        position: { x_position: 0, y_position: 0 },
        type: 'american_stock',// 수정 형식 추가하기
        action: 'index',// 수정 형식 추가하기
        state: 'index'// 수정 형식 추가하기
    }, maxAssetValue);

    nodes.push({
        id: `INDICATOR-${index}-^GSPC`,
        date: history.date,
        amount: 0.012,// 수정 가격에 맞춰서
        asset_symbol: '^GSPC',
        position: {
            
            x_position: state=='before' ? 0 : 100,// 수정 긴급 목업

            y_position: 50,// 수정 긴급 목업
        },
        type: 'american_stock',// 수정 형식 추가하기
        action: 'index',// 수정 형식 추가하기
        state: 'index',// 수정 형식 추가하기
        size: indicatorSize,
        value: history.state.cash
    });



    return nodes;
}
