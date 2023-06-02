// actions

// action types
export const SET_HISTORY = 'SET_HISTORY';
export const SET_CURRENT_MOVE = 'SET_CURRENT_MOVE';
export const SET_BOARD_SIZE = 'SET_BOARD_SIZE';
export const SET_WIN_LENGTH = 'SET_WIN_LENGTH';
export const SET_IS_ASCENDING = 'SET_IS_ASCENDING';
export const SET_WINNER = 'SET_WINNER';
export const SET_HIGHLIGHTED_LINE = 'SET_HIGHLIGHTED_LINE';
export const SET_CURRENT_IDX = 'SET_CURRENT_IDX';
export const SET_IS_AI = 'SET_IS_AI';
export const SET_IS_FIRST = 'SET_IS_FIRST';


/** 设置历史 */
export function setHistory (history: Array<Array<string | null>>) {
    return {
        type: SET_HISTORY,
        payload: history,
    };
}

/** 设置当前移动步骤 */
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

/** 设置胜利者 */
export function setWinner (winner: string) {
    return {
        type: SET_WINNER,
        payload: winner,
    };
}

/** 设置高亮线段 */
export function setHighlightedLine (highlightedLine: Board.HighlightedLineType) {
    return {
        type: SET_HIGHLIGHTED_LINE,
        payload: highlightedLine,
    };
}

/** 设置当前点击的棋子下标 */
export function setCurrentIdx (currentIdx: Board.CurrentIdxType) {
    return {
        type: SET_CURRENT_IDX,
        payload: currentIdx,
    };
}

/** 是否开启AI对局 */
export function setIsAI (isAI: Game.isAI) {
    return {
        type: SET_IS_AI,
        payload: isAI,
    };
}


/** 设置AI是否先手, 默认后 */
export function setIsAIFirst (isAIFirst: Game.isAIFirst) {
    return {
        type: SET_IS_FIRST,
        payload: isAIFirst,
    };
}

