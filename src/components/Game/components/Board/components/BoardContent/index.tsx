import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ChessPiece } from 'components';
import { setCurrentIdx } from 'store/actions';

/** 渲染棋盘格子 */
class BoardContent extends Component<Board.BoardContentProps> {
    constructor (props: Board.BoardContentProps) {
        super(props);
    }

    /** 改变Index */
    handleChangeCurrentIdx = (index: number) => {
        const { setCurrentIdx } = this.props;
        setCurrentIdx(index);
    };

    /** 判断是否能点击 */
    handleSquareClickIfNeeded () {
        const { currentIdx, onSquareClick } = this.props;
        if (currentIdx !== undefined) {
            onSquareClick(currentIdx);
        }
    }

    /** 更新棋盘数据 */
    componentDidUpdate () {
        this.handleSquareClickIfNeeded();
    }

    renderChessPiece () {
        const { boardSize, squares, highlightedLine } = this.props;

        return Array.from({ length: boardSize }).map((_item, index) => (
            <div key={index} className="board-row">
                {Array.from({ length: boardSize }).map((_jItem, jIndex) => {
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
