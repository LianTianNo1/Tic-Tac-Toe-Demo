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

    /** 判断棋盘数据的变化来重新计算 */
    componentDidUpdate (prevProps: Board.BoardProps) {
        if (prevProps.squares !== this.props.squares) {
            this.calculateWinnerAndHighlight();
        }
    }

    /** 计算胜利者和高亮路线 */
    calculateWinnerAndHighlight () {
        const { squares, boardSize, winLength, history = [], currentMove = 0 } = this.props;
        const { winner, highlightedLine } = calculateWinner(squares, (history as string [][])[currentMove - 1] || Array(squares.length).fill(null), {
            boardSize,
            winLength,
        });
        this.props.setHighlightedLine(highlightedLine);
        if (!winner) return;
        this.props.setWinner(winner as string);
    }

    /** 更新棋盘历史，棋盘 */
    handleSquareClick = (index: number) => {
        const { squares, xIsNext, boardSize, winLength, history = [], currentMove = 0, onPlay = blockFun } = this.props;
        const { winner } = calculateWinner(squares, (history as string [][])[currentMove - 1] || Array(squares.length).fill(null), { boardSize, winLength });
        if (squares[index] || winner) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[index] = X_SYMBOL;
        } else {
            nextSquares[index] = O_SYMBOL;
        }

        onPlay(nextSquares);
    };

    render () {
        const { boardSize, squares, xIsNext, winner, highlightedLine } = this.props;

        let status;
        if (winner) {
            status = `恭喜 ${winner} 赢得了本局比赛！！！`;
        } else if (Array.from(squares).every((sq) => sq !== null)) {
            status = '平局';
        } else {
            status = `下一个回合: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
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
