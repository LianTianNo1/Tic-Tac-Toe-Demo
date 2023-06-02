// import { BOARD_SIZE, DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE, DEFAULT_WIN_LENGTH } from 'components/Game';

/** 五子棋长度 */
export const DEFAULT_FIVE_BOARD_SIZE = 5;
/** 井字棋长度 */
export const DEFAULT_BOARD_SIZE = 3;
/** 默认连线长度 */
export const DEFAULT_WIN_LENGTH = 3;
/** 默认第0步 */
export const DEFAULT_CURRENT_MOVE = 0;
/** 棋盘大小 */
export const BOARD_SIZE = [Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')];

// 定义初始 state
export const initialState: MyRedux.StateType = {
    /** 棋盘历史记录 */
    history: BOARD_SIZE,
    /** 当前步数 */
    currentMove: DEFAULT_CURRENT_MOVE,
    /** 棋盘边长 */
    boardSize: DEFAULT_BOARD_SIZE,
    /** 连线长度 */
    winLength: DEFAULT_WIN_LENGTH,
    /** 排序 */
    isAscending: true,
    /** 胜利者 */
    winner: '',
    /** 高亮线段 */
    highlightedLine: [],
    /** 全局的点击下标 */
    currentIdx: undefined,
    /** 是否开启AI对局 */
    isAI: false,
    /** AI是否先手, 默认后手 */
    isAIFirst: false,
};
