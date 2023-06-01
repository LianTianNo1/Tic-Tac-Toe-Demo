/** 棋子相关 */
declare namespace Chess {
    export interface ChessPieceProps {
        /** 下标 */
        idx: number;
        /** 显示值 */
        value: string;
        /** 是否高亮 */
        highlight: boolean;
        /** 改变棋盘全局index事件 */
        onChangeCurrentIdx: (index: number) => void;
    }

}

/** 棋盘相关 */
declare namespace Board {
    /** 棋盘格子 */
    export interface BoardContentProps extends Board.BoardContentState{
        /** 棋盘数据 */
        squares: SquaresType;
        /** 棋盘大小 */
        boardSize: BoardSizeType;
        /** 高亮线 */
        highlightedLine: HighlightedLineType;
        /** 点击棋盘回调 */
        onSquareClick: (index: number) => void;
        /** 设置当前点击的棋子下标 */
        setCurrentIdx: (currentIdx: number) => void;
    }

    /** 棋盘状态 */
    export interface BoardContentState {
        /** 被点击棋子的下标 */
        currentIdx: Board.CurrentIdxType;
    }

    /** 棋盘 */
    export interface BoardProps extends Board.winnerDataType{
        /** 是否是AI先手 */
        isAIFirst: Game.isAIFirst;
        /** 历史记录 */
        history: Game.HistoryType;
        /** 当前步数 */
        currentMove: Game.currentMove;
        /** 下一步是X吗 */
        xIsNext: boolean;
        /** 存储棋盘的数据 */
        squares: SquaresType;
        /** 棋盘大小 */
        boardSize: BoardSizeType;
        /** 连线长度 */
        winLength: WinLengthType;
        /** 父类的更新历史的方法 */
        onPlay: (squares: SquaresType, history: Game.HistoryType, currentMove: Game.CurrentMoveType,  isAIFirst: Game.isAIFirst) => void;
    }

    /** 棋盘尺寸 胜利条件 */
    export interface CalculateWinnerArgs {
        /** 棋盘尺寸 */
        boardSize: BoardSizeType;
        /** 胜利条件 */
        winLength: WinLengthType;
    }

    /** 计算的赢的玩家是谁，赢的路线 */
    export interface winnerDataType {
        /** 赢的玩家是谁 */
        winner: WinnerType;
        /** 赢的路线 */
        highlightedLine: HighlightedLineType;
    }

    /** 棋盘数据 */
    export type SquaresType = string[];
    /** 棋盘大小 */
    export type BoardSizeType = number;
    /** 连线长度 */
    export type WinLengthType = number;
    /** 胜利者 */
    export type WinnerType = string | null;
    /** 高亮路线 */
    export type HighlightedLineType = number[] | null;
    /** 棋盘当前点击的Index */
    export type CurrentIdxType = number | undefined;
}

/** 游戏相关 */
declare namespace Game {
    export interface InputProps {
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

    /** 历史记录 */
    export interface HistoryState {
        /** 历史记录 */
        history: HistoryType;
        /** 当前步数 */
        currentMove: CurrentMoveType;
    }

    /** 游戏Props */
    export interface GameProps extends Game.HistoryState, Board.CalculateWinnerArgs{
        /** 当前的棋盘数据 */
        currentSquares: Board.SquaresType;
        /** 排序 */
        isAscending: IsAscendingType;
        /** 设置历史 */
        setHistory: (history: HistoryType) => void;
        /** 设置当前移动步骤 */
        setCurrentMove: (currentMove: CurrentMoveType) => void;
        /** 设置棋盘大小 */
        setBoardSize: (boardSize: Board.BoardSizeType) => void;
        /** 设置连线长度 */
        setWinLength: (boardwinLengthSize: Board.WinLengthType) => void;
        /** 设置排序 */
        setIsAscendinge: (isAscending: IsAscendingType) => void;
        /** 设置胜利者 */
        setWinner: (winner: string) => void;
        /** 设置高亮线段 */
        setHighlightedLine: (highlightedLine: Board.HighlightedLineType) => void;
        /** 设置当前点击的棋子下标 */
        setCurrentIdx: (currentIdx: number | undefined) => void;
    }

    /** 游戏State */
    export interface GameState {
        /** 是否AI */
        isAI: isAI;
        /** AI是否先手 */
        isAIFirst: isAIFirst;
    }

    /** 历史记录 */
    export type HistoryType = Board.SquaresType[];
    /** 当前移动第几步 */
    export type CurrentMoveType = number;
    /** 排序 */
    export type IsAscendingType = boolean;
    /** 是否AI */
    export type isAI = boolean;
    /** 是否AI先手 */
    export type isAIFirst = boolean;
}

/** redux相关 */
declare namespace MyRedux {
    /** ActionType */
    export interface ActionType {
        type: string;
        payload: any;
    }

    /** 初始化状态 */
    export interface StateType extends Game.HistoryState, Board.CalculateWinnerArgs, Board.winnerDataType, Board.BoardContentState{
        /** 排序 */
        isAscending: boolean;
    }
}
