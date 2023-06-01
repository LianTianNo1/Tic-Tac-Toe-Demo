/* eslint-disable no-console */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGameBoardRule } from 'hooks';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory, setCurrentMove } from 'store/actions';
import { O_SYMBOL, X_SYMBOL } from './useBoard';
import { DEFAULT_BOARD_SIZE, DEFAULT_CURRENT_MOVE } from './useGameBoardRule';
import { calculateWinner } from 'utils';

/** 管理游戏状态 */
export default function useGameState () {
    const {
        boardSize,
        winLength,
        setBoardSize,
        setWinLength,
        handleBoardSizeChange,
        handleWinLengthChange,
    } = useGameBoardRule();

    const dispatch = useDispatch();
    /** 游戏历史记录 */
    const history = useSelector((state: Game.HistoryState) => state.history);
    /** 当前所在的步骤 */
    const currentMove = useSelector((state: Game.HistoryState) => state.currentMove);
    // 添加排序标志
    const [isAscending, setIsAscending] = useState<Game.IsAscendingType>(true);
    // 获取当前棋盘状态,从history中取currentMove对应的棋盘状态
    const currentSquares = history[currentMove];
    // 如果 currentMove 是偶数,则 xIsNext 为 true 反之 xIsNext 为 false可以清楚地知道在任何一步,该谁下棋(默认是X或O)。
    const xIsNext = useMemo(() => currentMove % 2 === 0, [currentMove]);

    const [isAI, setIsAI] = useState<boolean>(false);
    const [isAIFirst, setIsAIFirst] = useState<boolean>(false);
    const [AIPlayer, setAIPlayer] = useState<string>(X_SYMBOL);


    useEffect(() => {
        console.log('isAIFirst改变了', isAIFirst, 'AIPlayer', isAIFirst ? X_SYMBOL : O_SYMBOL);
        setAIPlayer(isAIFirst ? X_SYMBOL : O_SYMBOL);
    }, [isAIFirst]);

    useEffect(() => {
        // 判断下一个玩家是X还是O
        const currentPlayer = (currentMove) % 2 === 0 ? X_SYMBOL : O_SYMBOL;
        // AI 是如果先手默认是X 后手默认是 O
        const AIPlayer = isAIFirst ? X_SYMBOL : O_SYMBOL;
        // 如果开启了AI对局且下一个对局是AI回合，则触发AI落子
        const isAIStep = currentPlayer === AIPlayer;
        // console.log('是否AI对局', isAI, '是否AI轮到下棋', isAIStep, '当前移动步数', currentMove + 1, '当前玩家', currentPlayer, 'AI棋子', AIPlayer);
        if (isAI && isAIStep) {
            handleAIMove(history[currentMove]);
        }
    }, [currentMove, isAIFirst, isAI]);

    /** 重置状态 */
    const resetState = () => {
        /** 重置棋盘大小|步数|赢家|高亮路线|棋盘大小 */
        dispatch(setHistory([Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill('')]));
        dispatch(setCurrentMove(DEFAULT_CURRENT_MOVE));
        setBoardSize(DEFAULT_BOARD_SIZE);
        // this.props.setWinner('');
        // this.props.setHighlightedLine([]);
        // this.props.setBoardSize(DEFAULT_BOARD_SIZE);
    };

    /** 切换AI对局 */
    const toggleAI = () => {
        const _isAI = !isAI;
        setIsAI(_isAI);
        // 当前关闭AI战局，关闭AI先手
        if (!_isAI) setIsAIFirst(false);
        resetState();
    };

    /** 切换AI对局 */
    const toggleAIFirst = () => {
        const _isAIFirst = !isAIFirst;
        setIsAIFirst(_isAIFirst);
        resetState();

        // AI 是如果先手默认是X 后手默认是 O
        // const AIPlayer = _isAIFirst ? X_SYMBOL : O_SYMBOL;
        /** 如果AI对局并且AI先手 */
        if (isAI && _isAIFirst) {
            const _squares = Array(boardSize * boardSize).fill('');
            handleAIMove(_squares);
        }
    };

    /** AI移动 */
    const  handleAIMove = useCallback((nextSquares: Board.SquaresType) => {
        /** 当前棋盘数据 */
        const squares = nextSquares.slice();
        /** 上次棋盘数据 */
        const preSquares = (history as string [][])[currentMove - 1] || Array(squares.length).fill('');
        console.log('AIPlayer', AIPlayer);
        console.log('AIPlayer2', isAIFirst ? X_SYMBOL : O_SYMBOL);
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
            handlePlay(squares);
            return;
        }

        // 尝试每一个空格
        for (const index of emptySquares) {
            // 模拟落子
            squares[index] = AIPlayer;
            // 判断是否获胜
            const { winner } = calculateWinner(squares,  preSquares, {
                boardSize,
                winLength,
            });
                // 如果AI获胜了，直接返回
            if (winner === AIPlayer) {
                handlePlay(squares);
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
            const { winner } = calculateWinner(squares, preSquares, {
                boardSize,
                winLength,
            });
                // 如果对手获胜了，直接阻止对手获胜的落子
            if (winner === HumanPlayer) {
                squares[index] = AIPlayer;
                handlePlay(squares);
                return;
            }
            // 清空模拟的落子
            squares[index] = '';
        }

        // 随机选择一个空格落子
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const randomSquare = emptySquares[randomIndex];
        squares[randomSquare] = AIPlayer;
        handlePlay(squares);
    }, [isAIFirst]);


    /** 点击棋盘时的回调,更新history和xIsNext */
    const handlePlay = useCallback(
        (nextSquares: string[]) => {
            // 获取从history中前currentMove+1步的子数组,并拼接上nextSquares
            const nextHistory = [
                ...history.slice(0, currentMove + 1),
                nextSquares,
            ];

            // 更新history和currentMove
            dispatch(setHistory(nextHistory));
            dispatch(setCurrentMove(nextHistory.length - 1));
            console.log('currentMove-2', currentMove);
        },
        [boardSize, history, currentMove]
    );

    /** 跳转到history中的某一步 */
    const jumpTo = useCallback(
        (nextMove: number) => {
            setCurrentMove(nextMove);
            dispatch(setCurrentMove(nextMove));
        },
        [history]
    );

    /** 棋盘大小变化控制连线长度变化 */
    useEffect(() => {
        if (boardSize < winLength) {
            setWinLength(boardSize);
        }
    }, [boardSize]);


    /** 切换排序 */
    const toggleSortOrder = useCallback(() => {
        setIsAscending(!isAscending);
    }, [isAscending]);

    return {
        isAI,
        isAIFirst,
        xIsNext,
        history,
        boardSize,
        winLength,
        isAscending,
        currentMove,
        currentSquares,
        jumpTo,
        toggleAI,
        handlePlay,
        toggleAIFirst,
        toggleSortOrder,
        handleBoardSizeChange,
        handleWinLengthChange,
    };
}
