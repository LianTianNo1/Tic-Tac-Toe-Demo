import { blockFun } from 'utils';
import React from 'react';

/** 定义棋子ChessPiece组件 */
const ChessPiece = React.memo((props: Chess.ChessPieceProps) => {
    const { highlight = false, value = '', onChangeCurrentIdx = blockFun, idx } = props;
    console.warn('ChessPiece渲染');

    return (
        <button
            className={`square ${highlight ? 'highlight' : ''}`}
            onClick={ () => {
                onChangeCurrentIdx(idx);
            }}
        >
            {value}
        </button>
    );
});

export default ChessPiece;
