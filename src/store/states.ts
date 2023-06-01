import { DEFAULT_CURRENT_MOVE, DEFAULT_FIVE_BOARD_SIZE, DEFAULT_WIN_LENGTH } from 'components/Game';

// 定义初始 state
export const initialState: MyRedux.StateType = {
    history: [Array(DEFAULT_FIVE_BOARD_SIZE * DEFAULT_FIVE_BOARD_SIZE).fill('')],
    currentMove: DEFAULT_CURRENT_MOVE,
    boardSize: DEFAULT_FIVE_BOARD_SIZE,
    winLength: DEFAULT_WIN_LENGTH,
    isAscending: true,
    winner: '',
    highlightedLine: [],
    currentIdx: null,
};
