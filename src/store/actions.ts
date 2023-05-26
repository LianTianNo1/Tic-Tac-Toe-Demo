// actions

// action types
export const SET_HISTORY = 'SET_HISTORY';
export const SET_CURRENT_MOVE = 'SET_CURRENT_MOVE';

/** 设置历史 */
export function setHistory (history: Array<Array<string | null>>) {
    return {
        type: SET_HISTORY,
        payload: history,
    };
}
/** 设置当前移动 */
export function setCurrentMove (currentMove: number) {
    return {
        type: SET_CURRENT_MOVE,
        payload: currentMove,
    };
}
