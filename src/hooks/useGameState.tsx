import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGameBoardRule } from 'hooks';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory, setCurrentMove } from 'store/actions';

/** 管理游戏状态 */
export default function useGameState () {
    const {
        boardSize,
        winLength,
        setWinLength,
        handleBoardSizeChange,
        handleWinLengthChange,
    } = useGameBoardRule();

    const dispatch = useDispatch();
    /** 游戏历史记录 */
    const history = useSelector((state: HistoryState) => state.history);
    /** 当前所在的步骤 */
    const currentMove = useSelector((state: HistoryState) => state.currentMove);
    // 添加排序标志
    const [isAscending, setIsAscending] = useState<IsAscendingType>(true);
    // 获取当前棋盘状态,从history中取currentMove对应的棋盘状态
    const currentSquares = history[currentMove];
    // 如果 currentMove 是偶数,则 xIsNext 为 true 反之 xIsNext 为 false可以清楚地知道在任何一步,该谁下棋(默认是X或O)。
    const xIsNext = useMemo(() => currentMove % 2 === 0, [currentMove]);

    /** 点击棋盘时的回调,更新history和xIsNext */
    const handlePlay = useCallback(
        (nextSquares: string[]) => {
            // 获取从history中前currentMove+1步的子数组,并拼接上nextSquares
            const nextHistory = [
                ...history.slice(0, currentMove + 1),
                nextSquares,
            ];
            // 更新history和currentMove
            dispatch(setHistory(nextHistory));
            dispatch(setCurrentMove(nextHistory.length - 1));
        },
        [boardSize, history, currentMove]
    );

    /** 跳转到history中的某一步 */
    const jumpTo = useCallback(
        (nextMove: number) => {
            setCurrentMove(nextMove);
            dispatch(setCurrentMove(nextMove));
        },
        [history]
    );

    /** 棋盘大小变化控制连线长度变化 */
    useEffect(() => {
        if (boardSize < winLength) {
            setWinLength(boardSize);
        }
    }, [boardSize]);


    /** 切换排序 */
    const toggleSortOrder = useCallback(() => {
        setIsAscending(!isAscending);
    }, [isAscending]);

    return {
        xIsNext,
        history,
        boardSize,
        winLength,
        isAscending,
        currentMove,
        currentSquares,
        jumpTo,
        handlePlay,
        toggleSortOrder,
        handleBoardSizeChange,
        handleWinLengthChange,
    };
}
