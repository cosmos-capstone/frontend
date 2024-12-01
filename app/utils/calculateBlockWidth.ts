import { Block } from '../types/types';

export const MIN_BLOCK_WIDTH = 50; // 최소 블록 너비
export const MAX_BLOCK_WIDTH = 200; // 최대 블록 너비
export const BASE_TIME_DIFFERENCE = 1; // 기본 시간 차이 (1일)
export const MAX_TIME_DIFFERENCE = 30; // 최대 고려할 시간 차이 (30일)

export function calculateBlockWidth(normalizedTimeDifference: number): number {
    // 정규화된 시간 차이를 0-1 사이의 값으로 변환
    const scale = Math.min(1, normalizedTimeDifference / MAX_TIME_DIFFERENCE);
    
    // 로그 스케일을 사용하여 너비 계산
    return MIN_BLOCK_WIDTH + (MAX_BLOCK_WIDTH - MIN_BLOCK_WIDTH) * Math.log1p(scale * 10) / Math.log1p(10);
}

export function calculateTimeDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24); // 일 단위로 반환
}

export function normalizeTimeDifference(timeDifference: number): number {
    return Math.max(BASE_TIME_DIFFERENCE, Math.min(timeDifference, MAX_TIME_DIFFERENCE));
}

export function blockWidthCalculate(currentDate: Date, previousBlockDate?: Date): number {
    if (!previousBlockDate) {
        return calculateBlockWidth(0); // 첫 번째 블록의 경우 최소 너비 반환
    }

    const timeDifference = calculateTimeDifference(previousBlockDate, currentDate);
    const normalizedTimeDifference = normalizeTimeDifference(timeDifference);
    return calculateBlockWidth(normalizedTimeDifference);
}