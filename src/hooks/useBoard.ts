import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { blockFun, calculateWinner } from 'utils';

/** 棋子内容 */
export const X_SYMBOL = 'X';
export const O_SYMBOL = 'O';

/** 棋盘hook */
export default function useBoard (props: BoardProps) {
    const { boardSize, winLength, xIsNext, squares, onPlay = blockFun } = props;

    /** 赢家 */
    const [winner, setWinner] = useState<WinnerType>('');
    /** 高亮线段 */
    const [highlightedLine, setHighlightedLine] = useState<HighlightedLineType>([]);
    /** 历史游戏 */
    const history = useSelector((state: HistoryState) => state.history);
    /** 当前所在的步骤 */
    const currentMove = useSelector((state: HistoryState) => state.currentMove);

    /** 计算赢家 */
    useEffect(() => {
        const winnerData: winnerDataType = calculateWinner(squares, (history[currentMove - 1] || Array(squares.length).fill(null)) as string [], {
            boardSize,
            winLength,
        }) as winnerDataType;
        setWinner(winnerData && winnerData.winner);
        setHighlightedLine(winnerData && winnerData.highlightedLine);
    }, [squares, boardSize, winLength]);

    /** 点击棋盘时的回调 */
    const handleSquareClick = useCallback(
        (index: number) => {
            // 如果有赢家或者已经下过了,就返回
            if (
                squares[index] ||
                calculateWinner(squares, (history[currentMove - 1] || Array(squares.length).fill(null)) as string [], { boardSize, winLength })
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
        boardSize,
        squares,
        highlightedLine,
        handleSquareClick,
    };
}
