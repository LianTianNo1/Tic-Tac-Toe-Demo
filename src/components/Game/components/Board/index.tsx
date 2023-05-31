/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BoardContent } from 'components';
import { blockFun, calculateWinner } from 'utils';
import { setHighlightedLine, setWinner } from 'store/actions';

/** 棋子内容 */
export const X_SYMBOL = 'X';
export const O_SYMBOL = 'O';

/** 定义棋盘Board组件 */
class Board extends Component<Board.BoardProps> {
    constructor (props: Board.BoardProps) {
        super(props);
    }

    /** 更新棋盘历史，棋盘 */
    handleSquareClick = (index: number) => {
        const { squares, xIsNext, boardSize, winLength, history = [], currentMove = 0, isAIFirst = false, onPlay = blockFun } = this.props;
        const { winner } = calculateWinner(squares, (history as string [][])[currentMove - 1] || Array(squares.length).fill(''), { boardSize, winLength });
        if (squares[index] || winner) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[index] = X_SYMBOL;
        } else {
            nextSquares[index] = O_SYMBOL;
        }

        onPlay(nextSquares, history, currentMove, isAIFirst);
    };

    render () {
        const { boardSize, squares, xIsNext, winner, highlightedLine } = this.props;

        let status;
        if (winner) {
            status = `恭喜 ${winner} 赢得了本局比赛！！！`;
        } else if (Array.from(squares).every((sq) => sq !== '')) {
            status = '平局';
        } else {
            status = `下一个回合: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
        }

        return (
            <>
                <div className="status">{status}</div>
                <BoardContent
                    boardSize={boardSize}
                    squares={squares}
                    highlightedLine={highlightedLine as number []}
                    onSquareClick={this.handleSquareClick}
                />
            </>
        );
    }
}

export default connect(
    (state: MyRedux.StateType) => ({
        winner: state.winner,
        highlightedLine: state.highlightedLine,
    }),
    {
        setWinner,
        setHighlightedLine,
    }
)(Board);
