import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { blockFun, calculateWinner } from 'utils';
import { BoardContent } from 'components';

export interface BoardProps {
    /** 棋盘大小 */
    boardSize: number;
    /** 连线长度 */
    winLength: number;
    /** 是否X，用来判断X或者O */
    xIsNext: boolean;
    /** 存储棋盘的数据 */
    squares: string[];
    /** 父类的更新历史的方法 */
    onPlay: (squares: string[]) => void;
}

/** 胜利者 */
type WinnerType = string;
/** 高亮路线 */
type HighlightedLineType = number[];

/** 计算的赢的玩家是谁，赢的路线 */
interface winnerDataType {
    winner: WinnerType;
    highlightedLine: HighlightedLineType;
}

/** 棋子内容 */
const X_SYMBOL = 'X';
const O_SYMBOL = 'O';

/** 棋盘hook */
export default function useBoard (props: BoardProps) {
    const { boardSize, winLength, xIsNext, squares, onPlay = blockFun } = props;

    // 赢家
    const [winner, setWinner] = useState<WinnerType>('');
    // 高亮线段
    const [highlightedLine, setHighlightedLine] = useState<HighlightedLineType>([]);

    /** 计算赢家 */
    useEffect(() => {
        const winnerData: winnerDataType = calculateWinner(squares, {
            boardSize,
            winLength,
        }) as winnerDataType;
        setWinner(winnerData && winnerData.winner);
        setHighlightedLine(winnerData && winnerData.highlightedLine);
    }, [squares, boardSize, winLength]);

    /** 棋盘状态 */
    const status = useMemo(() => {
        if (winner) {
            return `恭喜 ${winner} 赢得了本局比赛！！！`;
        } else if (Array.from(squares).every((sq) => sq !== null)) {
            return '平局';
        }
        return `下一个回合: ${xIsNext ? X_SYMBOL : O_SYMBOL}`;
    }, [winner, squares]);

    /** 点击棋盘时的回调 */
    const handleSquareClick = useCallback(
        (index: number) => {
            // 如果有赢家或者已经下过了,就返回
            if (
                squares[index] ||
                calculateWinner(squares, { boardSize, winLength })
            ) {
                return;
            }
            const nextSquares = squares.slice();
            // 根据xIsNext判断该下X棋还是O棋
            if (xIsNext) {
                nextSquares[index] = X_SYMBOL;
            } else {
                nextSquares[index] = O_SYMBOL;
            }
            // 调用上层Game组件传递的onPlay方法
            onPlay(nextSquares);
        },
        [squares]
    );

    return {
        winner,
        status,
        highlightedLine,
        board: (
            <BoardContent
                boardSize={boardSize}
                squares={squares}
                highlightedLine={highlightedLine}
                onSquareClick={handleSquareClick}
            />
        ),
        handleSquareClick,
    };
}
