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
    setIsAI,
    setIsAIFirst,
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

class Game extends Component<Game.GameProps> {
    constructor (props: Game.GameProps) {
        super(props);
    }

    /** 棋盘大小改变 */
    handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {  setBoardSize } = this.props;

        const size = Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value));
        setBoardSize(size);
        this.resetState(1, size);
        /** 重置棋盘大小和步数 */
    };

    /** 连线长度改变 */
    handleWinLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { boardSize, setWinLength } = this.props;

        const winLength = Math.min(
            Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value)),
            boardSize
        );
        setWinLength(winLength);
        /** 重置棋盘大小和步数 */
        this.resetState(2);
    };

    /** AI移动 */
    handleAIMove = (nextSquares: Board.SquaresType,  nextHistory: Game.HistoryType, currentMove: Game.CurrentMoveType, AIPlayer: string, isAIFirst: Game.isAIFirst  = false) => {
        const { boardSize, winLength } = this.props;
        /** 当前棋盘数据 */
        const squares = nextSquares.slice();
        /** 当前棋盘数据 */
        const curSquares = (nextHistory as string [][])[currentMove] || Array(squares.length).fill('');
        /** 人类玩家棋子 */
        const HumanPlayer = AIPlayer === X_SYMBOL ? O_SYMBOL : X_SYMBOL;
        /** 空位 */
        const emptySquares = squares.reduce((acc: number[], square: string, index: number) => {
            if (square === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        // 只针对井字棋后手第一步先判断中心有没有人下，没有的话就不乱下，先下中心
        if (
            (emptySquares.length === nextSquares.length - 1 ||  emptySquares.length === nextSquares.length) &&
            nextSquares.length === DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE &&
            !nextSquares[4]
        ) {
            squares[4] = AIPlayer;
            this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
            return;
        }

        // 尝试每一个空格
        for (const index of emptySquares) {
            // 模拟落子
            squares[index] = AIPlayer;
            // 判断是否获胜
            const { winner } = calculateWinner(squares,  curSquares, {
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
            squares[index] = HumanPlayer;
            // 判断对手是否获胜
            const { winner } = calculateWinner(squares, curSquares, {
                boardSize,
                winLength,
            });
            // 如果对手获胜了，直接阻止对手获胜的落子
            if (winner === HumanPlayer) {
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
        this.handlePlay(squares, nextHistory, currentMove, isAIFirst);
    };

    /** 更新历史和当前步骤 nextSquares 是当前棋盘数据 */
    handlePlay = (nextSquares: Board.SquaresType, history: Game.HistoryType, currentMove: Game.CurrentMoveType, isAIFirst: Game.isAIFirst  = false) => {
        const { isAI, boardSize, winLength, setHistory, setCurrentMove, setWinner, setHighlightedLine } = this.props;

        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            nextSquares,
        ];
        // 设置历史
        setHistory(nextHistory);
        // 设置当前移动步骤
        setCurrentMove(nextHistory.length - 1);

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
            setWinner(_winner);
            setHighlightedLine(highlightedLine);
            return;
        }

        // 判断下一个玩家是X还是O
        const currentPlayer = (currentMove + 1) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        if (isAI && isAIStep) {
            this.handleAIMove(nextSquares, nextHistory, nextHistory.length - 1, AIPlayer, isAIFirst);
        }
    };

    /** 跳转步骤 */
    jumpTo = (nextMove: number) => {
        const { history, winLength, boardSize, setWinner, setHighlightedLine, setCurrentMove } = this.props;
        /** 计算胜利者 */
        const preSquares = (history as string [][])[nextMove - 1] || Array(boardSize * boardSize).fill('');
        const squares = (history as string [][])[nextMove];
        const { winner, highlightedLine } = calculateWinner(squares, preSquares, { boardSize, winLength });
        setWinner(winner);
        setHighlightedLine(highlightedLine);
        // 设置当前移动的步数
        setCurrentMove(nextMove);
    };

    /** 切换排序 */
    toggleSortOrder = () => {
        const { isAscending } = this.props;
        setIsAscendinge(!isAscending);
    };

    /** 重置状态 */
    resetState = (type: number, payload?: any) => {
        const { setCurrentIdx, setBoardSize, setHistory, setWinner, setHighlightedLine, setCurrentMove, boardSize } = this.props;
        /** 重置棋盘大小|步数|赢家|高亮路线|棋盘大小 */

        switch (type) {
            case 1: {
                setHistory([Array(payload * payload).fill('')]);
                break;
            }
            case 2: {
                setHistory([Array(boardSize * boardSize).fill('')]);
                break;
            }

            default: {
                setHistory(BOARD_SIZE);
                setBoardSize(DEFAULT_BOARD_SIZE);
            }
        }

        setCurrentMove(DEFAULT_CURRENT_MOVE);
        setWinner('');
        setHighlightedLine([]);
        setCurrentIdx(undefined);
    };

    /** 切换AI对局 */
    toggleAI = () => {
        const { isAI, setIsAI, setIsAIFirst } = this.props;
        const _isAI = !isAI;
        setIsAI(_isAI);
        // 当前关闭AI战局，关闭AI先手
        if (!_isAI) {
            setIsAIFirst(false);
        }
        this.resetState(0);
    };

    /** 切换AI对局 */
    toggleAIFirst = () => {
        const { boardSize, isAIFirst, isAI, setIsAIFirst } = this.props;
        const _isAIFirst = !isAIFirst;
        setIsAIFirst(_isAIFirst);
        this.resetState(0);

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
        const { boardSize, winLength, isAscending, history, currentMove, currentSquares, isAI, isAIFirst } = this.props;

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
    ({
        isAI,
        winner,
        history,
        isAIFirst,
        winLength,
        boardSize,
        isAscending,
        currentMove,
        highlightedLine,
    }: MyRedux.StateType) => ({
        isAI,
        winner,
        history,
        isAIFirst,
        winLength,
        boardSize,
        isAscending,
        currentMove,
        highlightedLine,
        currentSquares: history[currentMove],
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
        setIsAI,
        setIsAIFirst,
    }
)(Game);
