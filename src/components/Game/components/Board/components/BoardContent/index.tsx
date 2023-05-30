import React, { Component } from 'react';
import { ChessPiece } from 'components';

/** 渲染棋盘格子 */
export default class BoardContent extends Component<Board.BoardContentProps, Board.BoardContentState> {
    constructor (props: Board.BoardContentProps) {
        super(props);
        /** 维护棋盘的当前点击的下标 */
        this.state = { currentIdx: null };
    }

    /** 改变Index */
    handleChangeCurrentIdx = (index: number) => {
        this.setState({ currentIdx: index });
    };

    /** 更新棋盘数据 */
    componentDidUpdate (prevProps: Board.BoardContentProps, preState: Board.BoardContentState) {
        const { currentIdx } = this.state;
        const { onSquareClick } = this.props;

        if (currentIdx !== preState.currentIdx) {
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
