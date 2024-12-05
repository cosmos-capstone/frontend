export function extractIndexFromString(input: string): number | null {
    const match = input.match(/-(\d+)-/); // 숫자 형식의 index를 찾는 정규식
    if (match && match[1]) {
        return parseInt(match[1], 10); // 문자열을 숫자로 변환하여 반환
    }
    return null; // 매칭되지 않으면 null 반환
}