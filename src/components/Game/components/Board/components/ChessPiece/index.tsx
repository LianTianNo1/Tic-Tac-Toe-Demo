import { blockFun } from 'utils';
import React, { useCallback } from 'react';

/** 定义棋子Square组件 */
const ChessPiece = React.memo((props: ChessPieceProps) => {
    const { highlight = false, value = '', onSquareClick = blockFun, idx } = props;

    const handleSquareClick = useCallback(
        () => {
            onSquareClick(idx);
        },
        [onSquareClick, idx]
    );

    // eslint-disable-next-line no-console
    console.log('棋子');
    return (
        <button
            className={`square ${highlight ? 'highlight' : ''}`}
            onClick={handleSquareClick}
        >
            {value}
        </button>
    );
});

export default ChessPiece;
