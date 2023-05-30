import React, { Component } from 'react';
import { BoardContent } from 'components';
import { blockFun, calculateWinner } from 'utils';

/** 定义棋盘Board组件 */
export default class Board extends Component<Board.BoardProps, Board.winnerDataType> {
    constructor (props: Board.BoardProps) {
        super(props);
        this.state = {
            winner: '',
            highlightedLine: [],
        };
    }

    componentDidMount () {
        this.calculateWinnerAndHighlight();
    }

    /** 判断棋盘数据的变化来重新计算 */
    componentDidUpdate (prevProps: Board.BoardProps) {
        if (prevProps.squares !== this.props.squares) {
            this.calculateWinnerAndHighlight();
        }
    }

    /** 计算胜利者和高亮路线 */
    calculateWinnerAndHighlight () {
        const { squares, boardSize, winLength, history = [], currentMove = 0 } = this.props;
        const winnerData = calculateWinner(squares, (history as string [][])[currentMove - 1] || Array(squares.length).fill(null), {
            boardSize,
            winLength,
        });

        this.setState({
            winner: winnerData && winnerData.winner,
            highlightedLine: winnerData && winnerData.highlightedLine,
        });
    }

    /** 更新棋盘历史，棋盘 */
    handleSquareClick = (index: number) => {
        const { squares, xIsNext, boardSize, winLength, history, currentMove, onPlay = blockFun } = this.props;

        if (squares[index] || calculateWinner(squares, (history as string [][])[currentMove - 1] || Array(squares.length).fill(null), { boardSize, winLength })) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[index] = 'X';
        } else {
            nextSquares[index] = 'O';
        }

        onPlay(nextSquares);
    };

    render () {
        const { winner, highlightedLine } = this.state;
        const { boardSize, squares, xIsNext } = this.props;

        let status;
        if (winner) {
            status = `恭喜 ${winner} 赢得了本局比赛！！！`;
        } else if (Array.from(squares).every((sq) => sq !== null)) {
            status = '平局';
        } else {
            status = `下一个回合: ${xIsNext ? 'X' : 'O'}`;
        }

        return (
            <React.Fragment>
                <div className="status">{status}</div>
                <BoardContent
                    boardSize={boardSize}
                    squares={squares}
                    highlightedLine={highlightedLine as number []}
                    onSquareClick={this.handleSquareClick}
                />
            </React.Fragment>
        );
    }
}
