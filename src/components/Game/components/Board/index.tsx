import React from 'react';
import { useBoard } from 'hooks';
import BoardContent from './components/BoardContent';

/** 定义棋盘Board组件 */
export default function Board (props: BoardProps) {
    const {  status, boardSize, squares, highlightedLine, handleSquareClick } = useBoard(props);

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
