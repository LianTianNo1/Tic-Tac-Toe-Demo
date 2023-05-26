import { DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE } from 'hooks/useGameBoardRule';

// 定义初始 state
export const initialState: HistoryState = {
    history: [Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill(null)],
    currentMove: DEFAULT_CURRENT_MOVE,
};
