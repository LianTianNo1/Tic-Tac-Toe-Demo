import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHistory, setCurrentMove } from 'store/actions';

// 默认棋盘大小长度
export const DEFAULT_BOARD_SIZE = 6;
// 默认连线长度
const DEFAULT_WIN_LENGTH = 3;
// 默认第0步
export const DEFAULT_CURRENT_MOVE = 0;

/** 设置游戏棋盘规则大小和连线长度 */
export default function useGameBoardRule () {
    // 棋盘大小
    const [boardSize, setBoardSize] = useState<BoardSizeType>(DEFAULT_BOARD_SIZE);
    // 连线长度
    const [winLength, setWinLength] = useState<WinLengthType>(DEFAULT_WIN_LENGTH);
    const dispatch = useDispatch();

    /** 棋盘大小变化 */
    const handleBoardSizeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const size = Math.max(
                DEFAULT_WIN_LENGTH,
                Number(event.target.value)
            );
            setBoardSize(size);
            dispatch(setHistory([Array(size * size).fill(null)]));
            dispatch(setCurrentMove(DEFAULT_CURRENT_MOVE));
        },
        []
    );

    /** 连线长度变化 */
    const handleWinLengthChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setWinLength(Math.min(
                Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value)),
                boardSize
            ));
        },
        [boardSize]
    );

    return {
        boardSize,
        winLength,
        history,
        handleBoardSizeChange,
        handleWinLengthChange,
        setWinLength,
    };
}
