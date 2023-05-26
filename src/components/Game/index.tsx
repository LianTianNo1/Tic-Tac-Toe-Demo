import React from 'react';
import { Board, Input } from 'components';
import { useGameState } from 'hooks';

/** Game组件 */
export default function Game () {
    const {
        xIsNext,
        isAscending,
        sortedMoves,
        boardSize,
        winLength,
        currentSquares,
        handlePlay,
        toggleSortOrder,
        handleBoardSizeChange,
        handleWinLengthChange,
    } = useGameState();

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
