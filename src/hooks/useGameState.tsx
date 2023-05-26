import { calculateRowCol } from 'utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoardState } from 'hooks';

export type IsAscendingType = boolean;

/** 管理游戏状态 */
export default function useGameState () {
    const {
        boardSize,
        winLength,
        history,
        currentMove,
        setHistory,
        setCurrentMove,
        setWinLength,
        handleBoardSizeChange,
        handleWinLengthChange,
    } = useBoardState();

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
            setHistory(nextHistory);
            setCurrentMove(nextHistory.length - 1);
        },
        [boardSize, history, currentMove]
    );

    /** 跳转到history中的某一步 */
    const jumpTo = useCallback(
        (nextMove: number) => {
            setCurrentMove(nextMove);
        },
        [history]
    );


    /** 棋盘大小变化控制连线长度变化 */
    useEffect(() => {
        if (boardSize < winLength) {
            setWinLength(boardSize);
        }
    }, [boardSize]);

    /** 渲染历史记录列表 */
    const moves = useMemo(() => {
        return history.map((record, move) => {
            let description;
            // 仅对于当前移动，显示不同的提示
            if (move === currentMove) {
                description = `您正在移动第${move}步`;
            } else if (move > 0) {
                // 如果不是第一步,显示跳转文字和行列号
                const rowCol = calculateRowCol(
                    history[move - 1],
                    history[move],
                    boardSize
                );
                description = `跳转到第 ${move} 步, 坐标 (${rowCol})`;
            } else {
                description = '进入游戏开始';
            }
            // 返回历史记录按钮
            return (
                <li key={move}>
                    {/* 判断正在移动还是跳转按钮 */}
                    {move === currentMove ? (
                        description
                    ) : (
                        <button onClick={() => jumpTo(move)}>
                            {description}
                        </button>
                    )}
                </li>
            );
        });
    }, [history, currentMove]);

    /** 根据isAscending排序moves,a.key和b.key代表了用于比较排序的键,在这里中就是每个move步数 */
    const sortedMoves = useMemo(() => {
        return isAscending
            ? moves
                .slice()
                .sort((pre, cur) => Number(pre.key) - Number(cur.key))
            : moves
                .slice()
                .sort((pre, cur) => Number(cur.key) - Number(pre.key));
    }, [isAscending, moves]);

    /** 切换排序 */
    const toggleSortOrder = useCallback(() => {
        setIsAscending(!isAscending);
    }, [isAscending]);

    return {
        xIsNext,
        boardSize,
        winLength,
        isAscending,
        sortedMoves,
        currentSquares,
        handlePlay,
        toggleSortOrder,
        handleBoardSizeChange,
        handleWinLengthChange,
    };
}
