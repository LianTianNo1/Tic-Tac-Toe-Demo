// actions

// action types
export const SET_HISTORY = 'SET_HISTORY';
export const SET_CURRENT_MOVE = 'SET_CURRENT_MOVE';
export const SET_IS_AI = 'SET_IS_AI';
export const SET_IS_AI_FIRST = 'SET_IS_AI_FIRST';
export const SET_AI_PLAYER = 'SET_AI_PLAYER';

/** 设置历史 */
export function setHistory (history: Game.HistoryType) {
    return {
        type: SET_HISTORY,
        payload: history,
    };
}
/** 设置当前移动 */
export function setCurrentMove (currentMove: Game.CurrentMoveType) {
    return {
        type: SET_CURRENT_MOVE,
        payload: currentMove,
    };
}

/** 设置AI战局 */
export function setIsAI (isAI: Game.isAIType) {
    return {
        type: SET_IS_AI,
        payload: isAI,
    };
}

/** 设置AI先手 */
export function setIsAIFirst (isAIFirst: Game.isAIFirstType) {
    return {
        type: SET_IS_AI_FIRST,
        payload: isAIFirst,
    };
}

/** 设置AI棋子 */
export function setAIPlayer (AIPlayer: Game.AIPlayerType) {
    return {
        type: SET_AI_PLAYER,
        payload: AIPlayer,
    };
}
