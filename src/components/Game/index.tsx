import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setHistory, setCurrentMove } from 'store/actions';
import { Board, Input } from 'components';
import { calculateRowCol } from 'utils';
import { Dispatch } from 'redux';

// 默认棋盘大小长度
export const DEFAULT_BOARD_SIZE = 6;
// 默认连线长度
const DEFAULT_WIN_LENGTH = 3;
// 默认第0步
export const DEFAULT_CURRENT_MOVE = 0;

class Game extends Component<Game.GameProps, Game.GameState> {
    constructor (props: Game.GameProps) {
        super(props);
        this.state = {
            boardSize: DEFAULT_BOARD_SIZE,
            winLength: DEFAULT_WIN_LENGTH,
            isAscending: true,
        };
    }

    /** 棋盘大小改变 */
    handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value));
        this.setState({ boardSize: size });
        /** 重置棋盘大小和步数 */
        this.props.setHistory([Array(size * size).fill(null)]);
        this.props.setCurrentMove(DEFAULT_CURRENT_MOVE);
    };

    /** 连线长度改变 */
    handleWinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { boardSize } = this.state;
        const winLength = Math.min(
            Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value)),
            boardSize
        );
        this.setState({ winLength });
    };

    /** 更新历史和当前步骤 */
    handlePlay = (nextSquares: Board.SquaresType) => {
        const { history, currentMove } = this.props;
        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            nextSquares,
        ];
        this.props.setHistory(nextHistory);
        this.props.setCurrentMove(nextHistory.length - 1);
    };

    /** 跳转步骤 */
    jumpTo = (nextMove: number) => {
        this.props.setCurrentMove(nextMove);
    };

    /** 切换排序 */
    toggleSortOrder = () => {
        const { isAscending } = this.state;
        this.setState({ isAscending: !isAscending });
    };

    /** 计算 xIsNext */
    private getXIsNext (): boolean {
        const { currentMove } = this.props;
        return currentMove % 2 === 0;
    }

    render () {
        const { boardSize, winLength, isAscending } = this.state;
        const {
            history,
            currentMove,
            currentSquares,
        } = this.props;

        /** 下一步回合是 X 吗 */
        const xIsNext: boolean = this.getXIsNext();

        /** 渲染历史记录列表 */
        const moves = history.map((record, move) => {
            let description;
            if (move === currentMove) {
                description = `您正在移动第${move}步`;
            } else if (move > 0) {
                const rowCol = calculateRowCol(
                    history[move - 1],
                    history[move],
                    boardSize
                );
                description = `跳转到第 ${move} 步, 坐标 (${rowCol})`;
            } else {
                description = '进入游戏开始';
            }

            return (
                <li key={move}>
                    {move === currentMove ? (
                        description
                    ) : (
                        <button onClick={() => this.jumpTo(move)}>
                            {description}
                        </button>
                    )}
                </li>
            );
        });

        /** 根据isAscending排序moves,a.key和b.key代表了用于比较排序的键,在这里中就是每个move步数 */
        const sortedMoves = isAscending
            ? [...moves].sort((pre, cur) => Number(pre.key) - Number(cur.key))
            : [...moves].sort((pre, cur) => Number(cur.key) - Number(pre.key));

        return (
            <div className="game">
                <div className="game-setting">
                    <Input
                        type="number"
                        value={boardSize}
                        onChange={this.handleBoardSizeChange}
                        label={`棋盘大小：${boardSize}x${boardSize}`}
                        style={{ marginRight: 20 }}
                    />
                    <Input
                        type="number"
                        value={winLength}
                        onChange={this.handleWinLengthChange}
                        label={`连线长度：当前规则${winLength}子棋`}
                    />
                </div>
                <div className="game-wrap">
                    <div className="game-board">
                        <Board
                            boardSize={boardSize}
                            winLength={winLength}
                            xIsNext={xIsNext}
                            history={history}
                            currentMove={currentMove}
                            squares={currentSquares}
                            onPlay={this.handlePlay}
                        />
                    </div>
                    <div className="game-info">
                        <button onClick={this.toggleSortOrder}>
                            {isAscending ? '正序' : '倒序'}
                        </button>
                        <ol className="record-list">{sortedMoves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}
/** 状态映射到props */
const mapStateToProps = (state: Game.HistoryState) => ({
    history: state.history,
    currentMove: state.currentMove,
    currentSquares: state.history[state.currentMove],
});

/** 操作映射到props */
const mapDispatchToProps = (dispatch: Dispatch) => ({
    setHistory: (history: string[][]) => dispatch(setHistory(history)),
    setCurrentMove: (currentMove: number) => dispatch(setCurrentMove(currentMove)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
