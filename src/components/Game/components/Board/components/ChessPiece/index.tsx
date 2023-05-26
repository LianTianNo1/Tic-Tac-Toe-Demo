import { blockFun } from 'utils';
import React, { useCallback } from 'react';

/** 定义棋子Square组件 */
const ChessPiece = React.memo((props: ChessPieceProps) => {
    const { highlight = false, value = '', onSquareClick = blockFun, idx } = props;

    const handleSquareClick = useCallback(
        () => {
            // eslint-disable-next-line no-console
            console.log('棋子');
            onSquareClick(idx);
        },
        [onSquareClick, idx]
    );

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
