import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'store';
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
import { O_SYMBOL, X_SYMBOL } from './components/Board';
import { calculateRowCol, calculateWinner } from 'utils';
import { BOARD_SIZE, DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE, DEFAULT_WIN_LENGTH } from 'store/states';

class Game extends Component<Game.GameProps> {
    constructor (props: Game.GameProps) {
        super(props);
    }

    /** 棋盘大小改变 */
    handleBoardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {  setBoardSize } = this.props;

        const size = Math.max(DEFAULT_WIN_LENGTH, Number(event.target.value));
        setBoardSize(size);
        this.handleResetState(1, size);
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
        this.handleResetState(2);
    };

    /** AI移动 */
    handleAIMove = () => {
        const { currentMove, history, isAIFirst } = store.getState();
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;

        const { boardSize, winLength } = this.props;
        /** 当前棋盘数据 */
        const squares = history[currentMove].slice(0);
        /** 当前棋盘数据 */
        const curSquares = squares.slice(0);
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
            (emptySquares.length === squares.length - 1 ||  emptySquares.length === squares.length) &&
            squares.length === DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE &&
            !squares[4]
        ) {
            squares[4] = AIPlayer;
            this.handlePlay(squares);
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
                this.handlePlay(squares);
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
                this.handlePlay(squares);
                return;
            }
            // 清空模拟的落子
            squares[index] = '';
        }

        // 随机选择一个空格落子
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const randomSquare = emptySquares[randomIndex];
        squares[randomSquare] = AIPlayer;
        this.handlePlay(squares);
    };

    /** 更新历史和当前步骤 nextSquares 是当前棋盘数据 */
    handlePlay = (nextSquares: Board.SquaresType) => {
        const { boardSize, winLength, setHistory, setCurrentMove, setWinner, setHighlightedLine } = this.props;
        const { currentMove, history, isAIFirst, isAI } = store.getState();

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
            this.handleAIMove();
        }
    };

    /** 跳转步骤 */
    handleJumpTo = (nextMove: number) => {
        const { history, winLength, boardSize, currentIdx, isAIFirst, isAI, setWinner, setHighlightedLine, setCurrentMove, setCurrentIdx } = this.props;
        if (currentIdx !== undefined) {
            setCurrentIdx(undefined);
        }
        /** 计算胜利者 */
        const preSquares = (history)[nextMove - 1] || Array(boardSize * boardSize).fill('');
        const squares = (history)[nextMove];
        const { winner, highlightedLine } = calculateWinner(squares, preSquares, { boardSize, winLength });
        setWinner(winner);
        setHighlightedLine(highlightedLine);
        // 设置当前移动的步数
        setCurrentMove(nextMove);

        // 判断下一个玩家是X还是O
        const currentPlayer = (nextMove) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        if (isAI && isAIStep) {
            this.handleAIMove();
        }
    };

    /** 切换排序 */
    handleToggleSortOrder = () => {
        const { isAscending } = this.props;
        setIsAscendinge(!isAscending);
    };

    /** 重置状态 */
    handleResetState = (type: number, payload?: any) => {
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
    handleToggleAI = () => {
        const { isAI, setIsAI, setIsAIFirst } = this.props;
        const _isAI = !isAI;
        setIsAI(_isAI);
        // 当前关闭AI战局，关闭AI先手
        if (!_isAI) {
            setIsAIFirst(false);
        }
        this.handleResetState(0);
    };

    /** 切换AI对局 */
    handlehandleToggleAIFirst = () => {
        const { isAIFirst, isAI, setIsAIFirst } = this.props;
        const _isAIFirst = !isAIFirst;
        setIsAIFirst(_isAIFirst);
        this.handleResetState(0);

        /** 如果AI对局并且AI先手 */
        if (isAI && _isAIFirst) {
            this.handleAIMove();
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

        // 判断下一个玩家是X还是O
        const currentPlayer = (currentMove) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        if (isAI && isAIStep) {
            this.handleAIMove();
        }

        // 棋盘大小
        const boardArea = boardSize * boardSize;

        /** 渲染历史记录列表 */
        const _history = history.length > boardArea ? history.slice(0, boardArea + 1) : history.slice(0);
        const moves = _history.map((record, move) => {
            let description;
            if (move === currentMove) {
                description = `${move !== 0 && isAI && AIPlayer !== currentPlayer ? 'AI' : '您'}正在移动第${move}步`;
            } else if (move > 0) {
                const rowCol = calculateRowCol(history[move - 1], history[move], boardSize);
                description = `跳转到第 ${move} 步, 坐标 (${rowCol})`;
            } else {
                description = '进入游戏开始';
            }

            let content;
            if (move === currentMove) {
                content = description;
            } else if (isAI) {
                if (move !== 0 && move % 2 === (isAIFirst ? 1 : 0)) {
                    content = `AI ${description.slice(3)}`;
                } else if (move !== 0 && move === currentMove - 1) {
                    content = `您目前在 ${description.slice(3)}`;
                } else {
                    content = (
                        <button onClick={() => this.handleJumpTo(move)}>
                            {description}
                        </button>
                    );
                }
            } else {
                content = (
                    <button onClick={() => this.handleJumpTo(move)}>
                        {description}
                    </button>
                );
            }

            return (
                <li key={move}>
                    {content}
                </li>
            );
        });


        /** 根据isAscending排序moves,a.key和b.key代表了用于比较排序的键,在这里中就是每个move步数 */
        const sortedMoves = isAscending
            ? [...moves].sort((pre, cur) => Number(pre.key) - Number(cur.key))
            : [...moves].sort((pre, cur) => Number(cur.key) - Number(pre.key));

        return (
            <div className="game">
                <button onClick={this.handleToggleAI}>{`${isAI ? '关闭' : '开启'}AI对局`}</button>
                {isAI && (<>
                    <button className='open-ai-btn' onClick={this.handlehandleToggleAIFirst}>{`${isAIFirst ? '关闭' : '开启'}AI先手`}</button>
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
                    {/* {
                        !isAI && <div className="game-info">
                            <button onClick={this.handleToggleSortOrder}>
                                {isAscending ? '正序' : '倒序'}
                            </button>
                            <ol className="record-list">{sortedMoves}</ol>
                        </div>
                    } */}

                    <div className="game-info">
                        <button onClick={this.handleToggleSortOrder}>
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
    ({
        isAI,
        winner,
        history,
        isAIFirst,
        winLength,
        boardSize,
        currentIdx,
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
        currentIdx,
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
