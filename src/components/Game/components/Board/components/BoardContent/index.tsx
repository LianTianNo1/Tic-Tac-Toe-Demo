import React, { useMemo } from 'react';
import { ChessPiece } from 'components';

/** 渲染棋盘格子 */
export default React.memo((props: BoardContentProps) => {
    const { boardSize, squares, highlightedLine, onSquareClick } = props;

    const renderChessPiece = useMemo(
        () =>
            Array.from({ length: boardSize }).map((__, index) => (
                <div key={index} className="board-row">
                    {Array.from({ length: boardSize }).map((__, jIndex) => {
                        const squareIndex = (index * boardSize) + jIndex;
                        return (
                            <ChessPiece
                                idx={squareIndex}
                                key={squareIndex}
                                value={squares[squareIndex]}
                                onSquareClick={onSquareClick}
                                highlight={highlightedLine?.includes(squareIndex) || false}
                            />
                        );
                    })}
                </div>
            )),
        [boardSize, squares, highlightedLine, onSquareClick]
    );

    return <>{renderChessPiece}</>;
});