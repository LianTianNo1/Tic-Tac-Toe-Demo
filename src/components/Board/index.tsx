import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Square } from 'components';
import { blockFun, calculateWinner } from 'utils';

interface BoardProps {
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

interface BoardState {
    winner: string;
    line: number[];
}

/** 定义棋盘Board组件 */
export default function Board (props: BoardProps) {
    const { boardSize, winLength, xIsNext, squares, onPlay = blockFun } = props;

    // 赢家
    const [winner, setWinner] = useState<BoardState['winner']>('');
    // 高亮线段
    const [line, setLine] = useState<BoardState['line']>([]);

    // 计算赢家
    useEffect(() => {
        const winnerData: BoardState = calculateWinner(squares, {
            boardSize,
            winLength,
        }) as BoardState;
        setWinner(winnerData && winnerData.winner);
        setLine(winnerData && winnerData.line);
    }, [squares, boardSize, winLength]);

    const status = useMemo(() => {
        if (winner) {
            return `胜利者: ${winner}`;
        } else if (Array.from(squares).every((sq) => sq !== null)) {
            return '平局';
        }
        return `下一个回合: ${xIsNext ? 'X' : 'O'}`;
    }, [winner, squares]);

    // 点击棋盘时的回调
    const handleClick = useCallback(
        (idx: number) => {
            // 如果有赢家或者已经下过了,就返回
            if (
                squares[idx] ||
                calculateWinner(squares, { boardSize, winLength })
            ) {
                return;
            }
            const nextSquares = squares.slice();
            // 根据xIsNext判断该下X棋还是O棋
            if (xIsNext) {
                nextSquares[idx] = 'X';
            } else {
                nextSquares[idx] = 'O';
            }
            // 调用上层Game组件传递的onPlay方法
            onPlay(nextSquares);
        },
        [squares]
    );

    // 使用两个循环生成棋盘格子
    const board = useMemo(() => {
        return Array.from({ length: boardSize }).map((
            _record,
            idx // 生成boardSize行
        ) => (
            <div key={idx} className="board-row">
                {Array.from({ length: boardSize }).map((
                    _record2,
                    jdx // 每行boardSize列
                ) => (
                    <Square
                        key={(idx * boardSize) + jdx}
                        value={squares[(idx * boardSize) + jdx]}
                        onSquareClick={() =>
                            handleClick((idx * boardSize) + jdx)
                        }
                        highlight={
                            (line &&
                                        line.includes((idx * boardSize) + jdx)) as boolean
                        } // 高亮square
                    />
                ))}
            </div>
        ));
    }, [squares, line, boardSize]);

    // 返回棋盘组件
    return (
        <React.Fragment>
            <div className="status">{status}</div>
            {board}
        </React.Fragment>
    );
}
