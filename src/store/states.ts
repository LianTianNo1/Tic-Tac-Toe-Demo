import { X_SYMBOL } from 'hooks/useBoard';
import { DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE } from 'hooks/useGameBoardRule';

// 定义初始 state
export const initialState: Game.HistoryState = {
    history: [Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')],
    currentMove: DEFAULT_CURRENT_MOVE,
    isAI: false,
    isAIFirst: false,
    AIPlayer: X_SYMBOL,
};
