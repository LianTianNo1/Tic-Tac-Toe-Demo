import { DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE } from 'components/Game';

// 定义初始 state
export const initialState: Game.HistoryState = {
    history: [Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill(null)],
    currentMove: DEFAULT_CURRENT_MOVE,
};
