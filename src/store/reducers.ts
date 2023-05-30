import { initialState } from './states';
import {
    SET_BOARD_SIZE, SET_CURRENT_MOVE, SET_HIGHLIGHTED_LINE, SET_HISTORY, SET_IS_ASCENDING, SET_WINNER, SET_WIN_LENGTH
} from './actions';

/** 定义 reducer */
export default function reducer (state = initialState, action: MyRedux.ActionType) {
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
        default:
            return state;
    }
}
