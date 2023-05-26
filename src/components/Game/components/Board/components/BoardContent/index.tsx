import React from 'react';
import { ChessPiece } from 'components';

/** 渲染棋盘格子 */
export default function BoardContent (props: BoardContentProps) {
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
                        <ChessPiece
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

