import React, { useMemo } from 'react';
import { Board, Input } from 'components';
import { useGameState } from 'hooks';
import { calculateRowCol } from 'utils';

/** Game组件 */
export default function Game () {
    const {
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
    } = useGameState();

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
                    history[move - 1] as string [],
                    history[move] as string [],
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

    // 返回游戏组件
    return (
        <div className="game">
            <div className="game-setting">
                {/* 添加输入框设置棋盘大小和连线长度 */}
                <Input
                    type="number"
                    value={boardSize}
                    onChange={handleBoardSizeChange}
                    label={`棋盘大小：${boardSize}x${boardSize}`}
                    style={{ marginRight: 20 }}
                />
                <Input
                    type="number"
                    value={winLength}
                    onChange={handleWinLengthChange}
                    label={`连线长度：当前规则${winLength}子棋`}
                />
            </div>
            <div className="game-wrap">
                <div className="game-board">
                    <Board
                        boardSize={boardSize}
                        winLength={winLength}
                        xIsNext={xIsNext}
                        squares={currentSquares as string []}
                        onPlay={handlePlay}
                    />
                </div>
                <div className="game-info">
                    {/* 添加排序按钮 */}
                    <button onClick={toggleSortOrder}>
                        {isAscending ? '正序' : '倒序'}
                    </button>
                    {/* 显示排序历史记录 */}
                    <ol className='record-list'>{sortedMoves}</ol>
                </div>
            </div>
        </div>
    );
}
