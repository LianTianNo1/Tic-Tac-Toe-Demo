import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChessPiece } from 'components';

/** 渲染棋盘格子 */
export default function BoardContent (props: Board.BoardContentProps) {
    const { boardSize, squares, highlightedLine, onSquareClick } = props;

    /** 维护棋盘的当前点击的下标 */
    const [currentIdx, setCurrentIdx] = useState<Board.CurrentIdxType>(null);

    /** 改变Index */
    const handleChangeCurrentIdx = useCallback((index: number) => {
        setCurrentIdx(index);
    }, []);

    useEffect(() => {
        onSquareClick(currentIdx as number);
    }, [currentIdx]);

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
                                onChangeCurrentIdx={handleChangeCurrentIdx}
                                highlight={highlightedLine?.includes(squareIndex) || false}
                            />
                        );
                    })}
                </div>
            )),
        [boardSize, squares, highlightedLine, onSquareClick]
    );

    return <>{renderChessPiece}</>;
}
