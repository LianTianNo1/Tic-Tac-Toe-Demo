import { initialState } from './states';
import {
    SET_BOARD_SIZE,
    SET_CURRENT_IDX,
    SET_CURRENT_MOVE,
    SET_HIGHLIGHTED_LINE,
    SET_HISTORY,
    SET_IS_AI,
    SET_IS_ASCENDING,
    SET_IS_FIRST,
    SET_WINNER,
    SET_WIN_LENGTH
} from './actions';

/** 定义 reducer */
export default function reducer (state: MyRedux.StateType = initialState, action: MyRedux.ActionType) {
    switch (action.type) {
        case SET_HISTORY:
            return {
                ...state,
                history: action.payload,
            };
        case SET_CURRENT_MOVE:
            return {
                ...state,
                currentMove: action.payload,
            };
        case SET_BOARD_SIZE:
            return {
                ...state,
                boardSize: action.payload,
            };
        case SET_WIN_LENGTH:
            return {
                ...state,
                winLength: action.payload,
            };
        case SET_IS_ASCENDING:
            return {
                ...state,
                isAscending: action.payload,
            };
        case SET_WINNER:
            return {
                ...state,
                winner: action.payload,
            };
        case SET_HIGHLIGHTED_LINE:
            return {
                ...state,
                highlightedLine: action.payload,
            };
        case SET_CURRENT_IDX:
            return {
                ...state,
                currentIdx: action.payload,
            };
        case SET_IS_AI:
            return {
                ...state,
                isAI: action.payload,
            };
        case SET_IS_FIRST:
            return {
                ...state,
                isAIFirst: action.payload,
            };
        default:
            return state;
    }
}
