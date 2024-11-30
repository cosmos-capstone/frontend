import { Block } from '../types/types';

const MIN_BLOCK_WIDTH = 100; // 최소 블록 너비
const MAX_BLOCK_WIDTH = 300; // 최대 블록 너비
const TIME_SCALE_FACTOR = 10; // 시간에 따른 크기 조정 계수

export function calculateBlockWidth(timeDifference: number): number {
    return Math.min(MAX_BLOCK_WIDTH, 
                    Math.max(MIN_BLOCK_WIDTH, 
                             MIN_BLOCK_WIDTH + timeDifference * TIME_SCALE_FACTOR));
}


export function calculateTimeDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24); // 일 단위로 반환
}



export function blockWidthCalculate( currentDate: Date,previousBlockDate?: Date ): number {
    if (!previousBlockDate) {
        return calculateBlockWidth(0); // 첫 번째 블록의 경우 기본 너비 반환
    }

    const timeDifference = calculateTimeDifference(previousBlockDate, currentDate);
    return calculateBlockWidth(timeDifference);
}