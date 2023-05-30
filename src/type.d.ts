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
        setCurrentIdx: (currentIdx: number) => void;
    }

    /** 棋盘状态 */
    export interface BoardContentState {
        /** 被点击棋子的下标 */
        currentIdx: Board.CurrentIdxType;
    }

    /** 棋盘 */
    export interface BoardProps extends Board.winnerDataType{
        /** 历史记录 */
        history: Game.HistoryState['history'];
        /** 当前步数 */
        currentMove: Game.HistoryState['currentMove'];
        /** 下一步是X吗 */
        xIsNext: boolean;
        /** 存储棋盘的数据 */
        squares: SquaresType;
        /** 棋盘大小 */
        boardSize: BoardSizeType;
        /** 连线长度 */
        winLength: WinLengthType;
        /** 是否X，用来判断X或者O */
        /** 父类的更新历史的方法 */
        onPlay: (squares: SquaresType) => void;
        setWinner: (winner: string) => void;
        setHighlightedLine: (highlightedLine: Board.HighlightedLineType) => void;
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
    export type CurrentIdxType = number | null;
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
        /** id用来label绑定input，如果不提供则使用value */
        /** 父类的更新历史的方法 */
        onChange: (params: any) => void;
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
        currentSquares: string[];
        /** 排序 */
        isAscending: boolean;
        setHistory: (history: string[][]) => void;
        setCurrentMove: (currentMove: number) => void;
        setBoardSize: (boardSize: number) => void;
        setWinLength: (boardwinLengthSize: number) => void;
        setIsAscendinge: (isAscending: boolean) => void;
    }

    /** 历史记录 */
    export type HistoryType = Board.SquaresType[];
    /** 当前移动第几步 */
    export type CurrentMoveType = number;
    /** 排序 */
    export type IsAscendingType = boolean;
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
