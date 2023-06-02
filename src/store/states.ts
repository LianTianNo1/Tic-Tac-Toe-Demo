import { BOARD_SIZE, DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE, DEFAULT_WIN_LENGTH } from 'components/Game';

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
