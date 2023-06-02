/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setHistory,
    setCurrentMove,
    setWinLength,
    setBoardSize,
    setIsAscendinge,
    setWinner,
    setHighlightedLine,
    setCurrentIdx,
} from 'store/actions';
import { Board, Input } from 'components';
import { calculateRowCol, calculateWinner } from 'utils';
import { O_SYMBOL, X_SYMBOL } from './components/Board';

/** 五子棋长度 */
export const DEFAULT_FIVE_BOARD_SIZE = 5;
/** 井字棋长度 */
export const DEFAULT_BOARD_SIZE = 3;
/** 默认连线长度 */
export const DEFAULT_WIN_LENGTH = 3;
/** 默认第0步 */
export const DEFAULT_CURRENT_MOVE = 0;
/** 棋盘大小 */
export const BOARD_SIZE = [Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')];
/** 最大深度 */
const DEPTH = 3;

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
        this.props.setWinner('');
        this.props.setHighlightedLine([]);
        this.props.setCurrentIdx(undefined);
    };

    /** 连线长度改变 */
    handleWinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { boardSize } = this.props;
        const winLength = Math.min(
            Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value)),
            boardSize
        );
        this.props.setWinLength(winLength);
        this.props.setCurrentIdx(undefined);
    };

    /** AI移动 */
    handleAIMove = (nextSquares: Board.SquaresType, nextHistory: Game.HistoryType, currentMove: Game.CurrentMoveType, AIPlayer: string, isAIFirst: Game.isAIFirst = false) => {
        const { boardSize, winLength } = this.props;
        const squares = nextSquares.slice();
        /** 当前棋盘数据 */
        const curSquares = (nextHistory as string[][])[currentMove] || Array(squares.length).fill('');
        /** 人类玩家棋子 */
        const HumanPlayer = AIPlayer === X_SYMBOL ? O_SYMBOL : X_SYMBOL;
        /** 空余位置 */
        const emptySquares = squares.reduce((acc: number[], square: string, index: number) => {
            if (square === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        // 选择角落位置作为第一步
        if (
            emptySquares.length === nextSquares.length - 1 &&
            nextSquares.length === DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE
        ) {
            const cornerIndices = [0, 2, 4, 6, 8];
            const randomIndex = Math.floor(Math.random() * cornerIndices.length);
            const cornerMove = cornerIndices[randomIndex];
            squares[cornerMove] = AIPlayer;
            this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
            return;
        }


        // 使用博弈树搜索找到最佳落子位置
        let bestMove = -1;
        let bestEval = -Infinity;
        for (let index = 0; index < emptySquares.length; index++) {
            const move = emptySquares[index];
            squares[move] = AIPlayer;
            // const evaluate = this.minimax(squares, curSquares, DEPTH, false, AIPlayer, HumanPlayer, boardSize, winLength);
            const evaluate = this.minimax(squares, curSquares, DEPTH, true, AIPlayer, HumanPlayer, boardSize, winLength);
            squares[move] = '';
            if (evaluate > bestEval) {
                bestEval = evaluate;
                bestMove = move;
            }
        }

        squares[bestMove] = AIPlayer;
        this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
    };

    /** 使用博弈树搜索找到最佳落子位置 */
    minimax = (squares: Board.SquaresType, curSquares: string[], depth: number, maximizingPlayer: boolean, AIPlayer: string, HumanPlayer: string, boardSize: number, winLength: number): number => {
        // 判断是否获胜或达到最大深度
        const { winner } = calculateWinner(squares, curSquares, { boardSize, winLength });
        if (winner === AIPlayer) {
            return maximizingPlayer ? 1 : -1;
        } else if (winner === HumanPlayer) {
            return maximizingPlayer ? -1 : 1;
        } else if (depth === 0) {
            return 0;
        }

        // 根据当前玩家进行递归搜索
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let index = 0; index < squares.length; index++) {
                if (squares[index] === '') {
                    squares[index] = AIPlayer;
                    const evaluate = this.minimax(squares, curSquares, depth - 1, false, AIPlayer, HumanPlayer, boardSize, winLength);
                    squares[index] = '';
                    maxEval = Math.max(maxEval, evaluate);
                }
            }
            return maxEval;
        }
        let minEval = Infinity;
        for (let index = 0; index < squares.length; index++) {
            if (squares[index] === '') {
                squares[index] = HumanPlayer;
                const evaluate = this.minimax(squares, curSquares, depth - 1, true, AIPlayer, HumanPlayer, boardSize, winLength);
                squares[index] = '';
                minEval = Math.min(minEval, evaluate);
            }
        }
        return minEval;
    };


    /** 更新历史和当前步骤 nextSquares 是当前棋盘数据 */
    handlePlay = (nextSquares: Board.SquaresType, history: Game.HistoryType, currentMove: Game.CurrentMoveType, isAIFirst: Game.isAIFirst  = false) => {
        const { isAI } = this.state;
        const { boardSize, winLength } = this.props;

        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            nextSquares,
        ];
        // 设置历史
        this.props.setHistory(nextHistory);
        // 设置当前移动步骤
        this.props.setCurrentMove(nextHistory.length - 1);

        /** 计算胜利者 */
        const preSquares = (history as string [][])[currentMove] || Array(nextSquares.length).fill('');
        const { winner, highlightedLine } = calculateWinner(nextSquares, preSquares, { boardSize, winLength });
        if (winner) {
            let _winner = '';
            if (isAI) {
                _winner = winner === (isAIFirst ? X_SYMBOL : O_SYMBOL) ? 'AI' : '你';
            } else {
                _winner = winner;
            }
            this.props.setWinner(_winner);
            this.props.setHighlightedLine(highlightedLine);
            return;
        }

        // 判断下一个玩家是X还是O
        const currentPlayer = (currentMove + 1) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        // console.log('是否AI对局', isAI, '是否AI轮到下棋', isAIStep, '当前移动步数', currentMove + 1, '当前玩家', currentPlayer, 'AI棋子', AIPlayer);
        if (isAI && isAIStep) {
            this.handleAIMove(nextSquares, nextHistory, nextHistory.length - 1, AIPlayer, isAIFirst);
        }
    };

    /** 跳转步骤 */
    jumpTo = (nextMove: number) => {
        const { history, winLength, boardSize } = this.props;
        /** 计算胜利者 */
        const preSquares = (history as string [][])[nextMove - 1] || Array(boardSize * boardSize).fill('');
        const squares = (history as string [][])[nextMove];
        const { winner, highlightedLine } = calculateWinner(squares, preSquares, { boardSize, winLength });
        this.props.setWinner(winner);
        this.props.setHighlightedLine(highlightedLine);
        // 设置当前移动的步数
        this.props.setCurrentMove(nextMove);
    };

    /** 切换排序 */
    toggleSortOrder = () => {
        const { isAscending } = this.props;
        this.props.setIsAscendinge(!isAscending);
    };

    /** 重置状态 */
    resetState = () => {
        /** 重置棋盘大小|步数|赢家|高亮路线|棋盘大小 */
        this.props.setCurrentMove(DEFAULT_CURRENT_MOVE);
        this.props.setWinner('');
        this.props.setHighlightedLine([]);
        this.props.setHistory(BOARD_SIZE);
        this.props.setBoardSize(DEFAULT_BOARD_SIZE);
        this.props.setCurrentIdx(undefined);
    };

    /** 切换AI对局 */
    toggleAI = () => {
        const { isAI } = this.state;
        const _isAI = !isAI;
        this.setState({ isAI: _isAI });
        // 当前关闭AI战局，关闭AI先手
        if (!_isAI) {
            this.setState({ isAIFirst: false });
        }
        this.resetState();
    };

    /** 切换AI对局 */
    toggleAIFirst = () => {
        const { isAIFirst, isAI } = this.state;
        const { boardSize } = this.props;
        const _isAIFirst = !isAIFirst;
        this.setState({ isAIFirst: _isAIFirst });
        this.resetState();

        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = _isAIFirst ? X_SYMBOL : O_SYMBOL;
        /** 如果AI对局并且AI先手 */
        if (isAI && _isAIFirst) {
            const _squares = Array(boardSize * boardSize).fill('');
            this.handleAIMove(_squares, [_squares], DEFAULT_CURRENT_MOVE, AIPlayer, _isAIFirst);
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
                {isAI && (<>
                    <button className='open-ai-btn' onClick={this.toggleAIFirst}>{`${isAIFirst ? '关闭' : '开启'}AI先手`}</button>
                    <div className='chess-piece-tip'>
                    当前AI棋子为 {isAIFirst ? X_SYMBOL : O_SYMBOL}
                    </div>
                </>)}

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
                    {
                        !isAI && <div className="game-info">
                            <button onClick={this.toggleSortOrder}>
                                {isAscending ? '正序' : '倒序'}
                            </button>
                            <ol className="record-list">{sortedMoves}</ol>
                        </div>
                    }

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
        winner: state.winner,
        highlightedLine: state.highlightedLine,
    }),
    {
        setHistory,
        setCurrentMove,
        setBoardSize,
        setWinLength,
        setIsAscendinge,
        setWinner,
        setHighlightedLine,
        setCurrentIdx,
    }
)(Game);
