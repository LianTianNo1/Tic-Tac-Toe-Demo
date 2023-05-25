import { useState } from 'react';

export type BoardSizeType = number;
export type WinLengthType = number;
export type HistoryType = string[][];
export type CurrentMoveType = number;

// 默认棋盘大小长度
const DEFAULT_BOARD_SIZE = 6;
// 默认连线长度
const DEFAULT_WIN_LENGTH = 3;
// 默认第0步
const DEFAULT_CURRENT_MOVE = 0;

/** 管理棋盘状态 */
export default function useBoardState () {
    // 棋盘大小
    const [boardSize, setBoardSize] = useState<BoardSizeType>(DEFAULT_BOARD_SIZE);
    // 连线长度
    const [winLength, setWinLength] = useState<WinLengthType>(DEFAULT_WIN_LENGTH);
    // useState hook 定义history和currentMove状态
    const [history, setHistory] = useState<HistoryType>([Array(boardSize * boardSize).fill(null)]);
    const [currentMove, setCurrentMove] =
        useState<CurrentMoveType>(DEFAULT_CURRENT_MOVE);

    /** 棋盘大小变化 */
    const handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = Number(event.target.value);
        if (size < 3) return;
        setBoardSize(size);
        // 重置历史
        setHistory([Array(size * size).fill(null)]);
        // 重置currentMove
        setCurrentMove(0);
    };

    /** 连线长度变化 */
    const handleWinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const len = Number(event.target.value);
        if (len < 3) return;
        if (len > boardSize) return console.error('超过范围');
        setWinLength(len);
    };

    return {
        boardSize,
        winLength,
        history,
        currentMove,
        handleBoardSizeChange,
        handleWinLengthChange,
        setHistory,
        setCurrentMove,
        setWinLength,
    };
}
