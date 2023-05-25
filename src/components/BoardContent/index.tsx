import React from 'react';
import { Square } from 'components';

interface BoardProps {
    /** 棋盘大小 */
    boardSize: number;
    /** 棋盘数据 */
    squares: string[];
    /** 高亮线 */
    highlightedLine: number[];
    /** 点击棋盘回调 */
    onSquareClick: (index: number) => void;
}
/** 渲染棋盘格子 */
export default function BoardContent (props: BoardProps) {
    const {
        boardSize,
        squares,
        highlightedLine,
        onSquareClick,
    } = props;

    return (
        <>
            {Array.from({ length: boardSize }).map((
                _record,
                index // 生成boardSize行
            ) => (
                <div key={index} className="board-row">
                    {Array.from({ length: boardSize }).map((
                        _record2,
                        jIndex // 每行boardSize列
                    ) => (
                        <Square
                            key={(index * boardSize) + jIndex}
                            value={squares[(index * boardSize) + jIndex]}
                            onSquareClick={() =>
                                onSquareClick((index * boardSize) + jIndex)
                            }
                            highlight={
                                (highlightedLine && highlightedLine.includes((index * boardSize) + jIndex)) as boolean
                            } // 高亮square
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

