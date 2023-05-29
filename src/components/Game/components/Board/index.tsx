import React, { useMemo } from 'react';
import BoardContent from './components/BoardContent';
import { useBoard } from 'hooks';
import { O_SYMBOL, X_SYMBOL } from 'hooks/useBoard';

/** 定义棋盘Board组件 */
export default function Board (props: Board.BoardProps) {
    const { winner, boardSize, squares, highlightedLine, handleSquareClick } = useBoard(props);

    /** 棋盘状态 */
    const status = useMemo(() => {
        if (winner) {
            return `恭喜 ${winner} 赢得了本局比赛！！！`;
        } else if (Array.from(squares).every((sq) => sq !== null)) {
            return '平局';
        }
        return `下一个回合: ${props.xIsNext ? X_SYMBOL : O_SYMBOL}`;
    }, [winner, squares]);

    // 返回棋盘组件
    return (
        <React.Fragment>
            <div className="status">{status}</div>
            <BoardContent
                boardSize={boardSize}
                squares={squares}
                highlightedLine={highlightedLine}
                onSquareClick={handleSquareClick}
            />
        </React.Fragment>
    );
}
