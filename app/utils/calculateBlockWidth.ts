const MIN_BLOCK_WIDTH = 200; // 최소 블록 너비
const MAX_BLOCK_WIDTH = 800; // 최대 블록 너비
const TIME_SCALE_FACTOR = 10; // 시간에 따른 크기 조정 계수

export function calculateBlockWidth(timeDifference: number): number {
    return Math.min(MAX_BLOCK_WIDTH, 
                    Math.max(MIN_BLOCK_WIDTH, 
                             MIN_BLOCK_WIDTH + timeDifference * TIME_SCALE_FACTOR));
}


export function calculateTimeDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24); // 일 단위로 반환
}