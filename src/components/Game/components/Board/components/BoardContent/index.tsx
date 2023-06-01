import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ChessPiece } from 'components';
import { setCurrentIdx } from 'store/actions';

/** 渲染棋盘格子 */
class BoardContent extends Component<Board.BoardContentProps, Board.BoardContentState> {
    constructor (props: Board.BoardContentProps) {
        super(props);
    }

    /** 改变Index */
    handleChangeCurrentIdx = (index: number) => {
        this.props.setCurrentIdx(index);
    };

    /** 更新棋盘数据 */
    componentDidUpdate () {
        const { currentIdx } = this.props;
        const { onSquareClick } = this.props;

        if (currentIdx !== undefined) {
            onSquareClick(currentIdx as number);
        }
    }

    renderChessPiece () {
        const { boardSize, squares, highlightedLine } = this.props;

        return Array.from({ length: boardSize }).map((__, index) => (
            <div key={index} className="board-row">
                {Array.from({ length: boardSize }).map((__, jIndex) => {
                    const squareIndex = (index * boardSize) + jIndex;
                    return (
                        <ChessPiece
                            idx={squareIndex}
                            key={squareIndex}
                            value={squares[squareIndex]}
                            onChangeCurrentIdx={this.handleChangeCurrentIdx}
                            highlight={highlightedLine?.includes(squareIndex) || false}
                        />
                    );
                })}
            </div>
        ));
    }

    render () {
        return <>{this.renderChessPiece()}</>;
    }
}

export default connect(
    (state: MyRedux.StateType) => ({ currentIdx: state.currentIdx }),
    { setCurrentIdx }
)(BoardContent);
