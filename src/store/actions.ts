// actions

// action types
export const SET_HISTORY = 'SET_HISTORY';
export const SET_CURRENT_MOVE = 'SET_CURRENT_MOVE';
export const SET_BOARD_SIZE = 'SET_BOARD_SIZE';
export const SET_WIN_LENGTH = 'SET_WIN_LENGTH';
export const SET_IS_ASCENDING = 'SET_IS_ASCENDING';


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
/** 设置棋盘大小 */
export function setBoardSize (boardSize: number) {
    return {
        type: SET_BOARD_SIZE,
        payload: boardSize,
    };
}
/** 设置连线长度 */
export function setWinLength (winLength: number) {
    return {
        type: SET_WIN_LENGTH,
        payload: winLength,
    };
}
/** 设置排序 */
export function setIsAscendinge (isAscending: boolean) {
    return {
        type: SET_IS_ASCENDING,
        payload: isAscending,
    };
}
