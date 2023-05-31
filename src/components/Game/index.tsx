/* eslint-disable no-debugger */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setHistory, setCurrentMove, setWinLength, setBoardSize, setIsAscendinge } from 'store/actions';
import { Board, Input } from 'components';
import { calculateRowCol, calculateWinner } from 'utils';
import { O_SYMBOL, X_SYMBOL } from './components/Board';

/** 默认棋盘大小长度 */
export const DEFAULT_BOARD_SIZE = 3;
/** 默认连线长度 */
export const DEFAULT_WIN_LENGTH = 3;
/** 默认第0步 */
export const DEFAULT_CURRENT_MOVE = 0;

class Game extends Component<Game.GameProps, Game.GameState> {
    constructor (props: Game.GameProps) {
        super(props);
        this.state = {
            /** 是否开启AI对局 */
            isAI: false,
            /** AI是否先手, 默认后手 */
            isAIFirst: false,
        };
    }

    /** 棋盘大小改变 */
    handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value));
        this.props.setBoardSize(size);
        /** 重置棋盘大小和步数 */
        this.props.setHistory([Array(size * size).fill('')]);
        this.props.setCurrentMove(DEFAULT_CURRENT_MOVE);
    };

    /** 连线长度改变 */
    handleWinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { boardSize } = this.props;
        const winLength = Math.min(
            Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value)),
            boardSize
        );
        this.props.setWinLength(winLength);
    };

    /** AI移动 */
    handleAIMove = (nextSquares: Board.SquaresType,  nextHistory: Game.HistoryType, currentMove: Game.CurrentMoveType, AIPlayer: string, isAIFirst: Game.isAIFirst  = false) => {
        const { boardSize, winLength } = this.props;
        console.log('nextSquares', nextSquares, 'currentMove', currentMove, 'history', nextHistory);
        const squares = nextSquares.slice();
        const emptySquares = squares.reduce((acc: number[], square: string, index: number) => {
            if (square === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        // 尝试每一个空格
        for (const index of emptySquares) {
            // 模拟落子
            squares[index] = AIPlayer;
            // 判断是否获胜
            const { winner } = calculateWinner(squares, (nextHistory as string [][])[currentMove - 1] || Array(squares.length).fill(''), {
                boardSize,
                winLength,
            });
            // 如果AI获胜了，直接返回
            if (winner === AIPlayer) {
                this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
                return;
            }
            // 清空模拟的落子
            squares[index] = '';
        }

        // 尝试对手的每一个空格
        for (const index of emptySquares) {
            // 模拟对手的落子
            squares[index] = AIPlayer === X_SYMBOL ? O_SYMBOL : X_SYMBOL;
            // 判断对手是否获胜
            const { winner } = calculateWinner(squares, (nextHistory as string [][])[currentMove - 1] || Array(squares.length).fill(''), {
                boardSize,
                winLength,
            });
            // 如果对手获胜了，直接阻止对手获胜的落子
            if (winner === (AIPlayer === X_SYMBOL ? O_SYMBOL : X_SYMBOL)) {
                squares[index] = AIPlayer;
                this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
                return;
            }
            // 清空模拟的落子
            squares[index] = '';
        }

        // 随机选择一个空格落子
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const randomSquare = emptySquares[randomIndex];
        squares[randomSquare] = AIPlayer;
        console.log('临时squares', squares,);
        this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
    };

    /** 更新历史和当前步骤 nextSquares 是当前棋盘数据 */
    handlePlay = (nextSquares: Board.SquaresType, history: Game.HistoryType, currentMove: Game.CurrentMoveType, isAIFirst: Game.isAIFirst  = false) => {
        // debugger;
        // const { history, currentMove } = this.props;
        const { isAI } = this.state;
        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            nextSquares,
        ];
        // 设置历史
        this.props.setHistory(nextHistory);
        // 设置当前移动步骤
        this.props.setCurrentMove(nextHistory.length - 1);

        // 判断下一个玩家是X还是O
        const currentPlayer = (currentMove + 1) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        console.log('让我看看现在的AI棋子', AIPlayer);
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        console.log('是否AI对局', isAI, '是否AI轮到下棋', isAIStep, '当前移动步数', currentMove + 1, '当前玩家', currentPlayer, 'AI棋子', AIPlayer);
        if (isAI && isAIStep) {
            this.handleAIMove(nextSquares, nextHistory, nextHistory.length - 1, AIPlayer, isAIFirst);
        }
    };

    /** 跳转步骤 */
    jumpTo = (nextMove: number) => {
        this.props.setCurrentMove(nextMove);
    };

    /** 切换排序 */
    toggleSortOrder = () => {
        const { isAscending } = this.props;
        this.props.setIsAscendinge(!isAscending);
    };

    /** 切换AI对局 */
    toggleAI = () => {
        const { isAI } = this.state;
        const _isAI = !isAI;
        this.setState({ isAI: _isAI });
        // 当前关闭AI战局，关闭AI先手
        if (!_isAI) this.setState({ isAIFirst: false });
        /** 重置棋盘大小和步数 */
        this.props.setHistory([Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')]);
        this.props.setCurrentMove(DEFAULT_CURRENT_MOVE);
    };

    /** 切换AI对局 */
    toggleAIFirst = () => {
        const { isAIFirst, isAI } = this.state;
        const { boardSize } = this.props;
        const _isAIFirst = !isAIFirst;
        this.setState({ isAIFirst: _isAIFirst });
        /** 重置棋盘大小和步数 */
        this.props.setHistory([Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')]);
        this.props.setCurrentMove(DEFAULT_CURRENT_MOVE);
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = _isAIFirst ? X_SYMBOL : O_SYMBOL;
        /** 如果AI对局并且AI先手 */
        if (isAI && _isAIFirst) {
            const _squares = Array(boardSize * boardSize).fill('');
            this.handleAIMove(_squares, [_squares], DEFAULT_CURRENT_MOVE, AIPlayer, _isAIFirst);
            console.log('先手了');
        }
    };

    /** 计算 xIsNext */
    private getXIsNext (): boolean {
        const { currentMove = 0 } = this.props;
        return currentMove % 2 === 0;
    }

    render () {
        const { boardSize, winLength, isAscending, history, currentMove, currentSquares } = this.props;
        const { isAI, isAIFirst } = this.state;

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
                <button onClick={this.toggleAI}>{`${isAI ? '关闭' : '开启'}AI对局`}</button>
                {isAI && <button onClick={this.toggleAIFirst}>{`${isAIFirst ? '关闭' : '开启'}AI先手`}</button>}
                {!isAI && <div className="game-setting">
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
                </div>}
                <div className="game-wrap">
                    <div className="game-board">
                        <Board
                            isAIFirst={isAIFirst}
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

export default connect(
    (state: MyRedux.StateType) => ({
        history: state.history,
        currentMove: state.currentMove,
        currentSquares: state.history[state.currentMove],
        boardSize: state.boardSize,
        winLength: state.winLength,
        isAscending: state.isAscending,
    }),
    {
        setHistory,
        setCurrentMove,
        setBoardSize,
        setWinLength,
        setIsAscendinge,
    }
)(Game);
