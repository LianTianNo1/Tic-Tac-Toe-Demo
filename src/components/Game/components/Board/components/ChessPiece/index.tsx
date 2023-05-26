import React from 'react';
import { blockFun } from 'utils';

/** 定义棋子Square组件 */
export default function ChessPiece (props: ChessPieceProps) {
    const { highlight = false, value = '', onSquareClick = blockFun } = props;

    return (
        <button
            className={`square ${highlight ? 'highlight' : ''}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}
