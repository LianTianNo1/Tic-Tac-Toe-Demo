import { initialState } from './states';
import { SET_AI_PLAYER, SET_CURRENT_MOVE, SET_HISTORY, SET_IS_AI, SET_IS_AI_FIRST } from './actions';

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
        case SET_IS_AI:
            return {
                ...state,
                isAI: action.payload,
            };
        case SET_IS_AI_FIRST:
            return {
                ...state,
                isAIFirst: action.payload,
            };
        case SET_AI_PLAYER:
            return {
                ...state,
                AIPlayer: action.payload,
            };
        default:
            return state;
    }
}
