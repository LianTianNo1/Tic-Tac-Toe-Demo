import { blockFun } from 'utils';
import React from 'react';

/** 定义棋子Square组件 */
const ChessPiece = React.memo((props: ChessPieceProps) => {
    const { highlight = false, value = '', onChangeCurrentIdx = blockFun, idx } = props;

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
