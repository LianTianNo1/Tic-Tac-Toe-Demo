import { initialState } from './states';
import { SET_CURRENT_MOVE, SET_HISTORY } from './actions';

/** 定义 reducer */
export default function reducer (state = initialState, action: any) {
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
        default:
            return state;
    }
}
