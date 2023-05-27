/** 棋盘格子 */
interface BoardContentProps {
    /** 棋盘大小 */
    boardSize: number;
    /** 棋盘数据 */
    squares: string[];
    /** 高亮线 */
    highlightedLine: number[];
    /** 点击棋盘回调 */
    onSquareClick: (index: number) => void;
}

/** 棋盘 */
interface BoardProps {
    /** 棋盘大小 */
    boardSize: number;
    /** 连线长度 */
    winLength: number;
    /** 是否X，用来判断X或者O */
    xIsNext: boolean;
    /** 存储棋盘的数据 */
    squares: string[];
    /** 父类的更新历史的方法 */
    onPlay: (squares: string[]) => void;
}

/** 计算的赢的玩家是谁，赢的路线 */
interface winnerDataType {
    winner: WinnerType;
    highlightedLine: HighlightedLineType;
}

interface ChessPieceProps {
    /** 显示值 */
    value: string;
    /** 改变棋盘全局index事件 */
    onChangeCurrentIdx: (index: number) => void;
    /** 是否高亮 */
    highlight: boolean;
    /** 下标 */
    idx: number;
}

interface InputProps {
    /** input类型 */
    type: string;
    /** 值 */
    value: string | number;
    /** 标题 */
    label: string | React.ReactElement;
    /** 父类的更新历史的方法 */
    onChange: (params: any) => void;
    /** id用来label绑定input，如果不提供则使用value */
    id?: string;
    /** 样式 */
    style?: React.CSSProperties;
}

/** 棋盘大小 */
type BoardSizeType = number;
/** 连线长度 */
type WinLengthType = number;
/** 历史记录 */
type HistoryType = string[][];
/** 当前移动第几步 */
type CurrentMoveType = number;
/** 排序 */
type IsAscendingType = boolean;
/** 胜利者 */
type WinnerType = string;
/** 高亮路线 */
type HighlightedLineType = number[];
/** 棋盘当前点击的Index */
type CurrentIdxType = number | null;

/** 历史记录 */
interface HistoryState {
    history: Array<Array<string | null>>;
    currentMove: number;
}

/** ActionType */
interface ActionType {
    type: string;
    payload: any;
}
