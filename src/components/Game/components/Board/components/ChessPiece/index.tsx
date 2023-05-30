import React, { Component } from 'react';
import { blockFun } from 'utils';

/** 定义棋子ChessPiece组件 */
class ChessPiece extends Component<Chess.ChessPieceProps> {
    shouldComponentUpdate (nextProps: Chess.ChessPieceProps) {
        if (
            nextProps.highlight !== this.props.highlight ||
            nextProps.value !== this.props.value ||
            nextProps.idx !== this.props.idx
        ) {
            return true;
        }
        return false;
    }

    render () {
        const { highlight = false, value = '', onChangeCurrentIdx = blockFun, idx } = this.props;

        return (
            <button
                className={`square ${highlight ? 'highlight' : ''}`}
                onClick={() => {
                    onChangeCurrentIdx(idx);
                }}
            >
                {value}
            </button>
        );
    }
}

export default React.memo(ChessPiece);
