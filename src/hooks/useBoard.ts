import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { blockFun, calculateWinner } from 'utils';

/** 棋子内容 */
export const X_SYMBOL = 'X';
export const O_SYMBOL = 'O';

/** 棋盘hook */
export default function useBoard (props: Board.BoardProps) {
    const { boardSize, winLength, xIsNext, squares, onPlay = blockFun } = props;

    /** 赢家 */
    const [winner, setWinner] = useState<Board.WinnerType>('');
    /** 高亮线段 */
    const [highlightedLine, setHighlightedLine] = useState<Board.HighlightedLineType>([]);
    /** 历史游戏 */
    const history = useSelector((state: Game.HistoryState) => state.history);
    /** 当前所在的步骤 */
    const currentMove = useSelector((state: Game.HistoryState) => state.currentMove);

    /** 计算赢家 */
    useEffect(() => {
        const { winner, highlightedLine } = calculateWinner(squares, (history[currentMove - 1] || Array(squares.length).fill('')), {
            boardSize,
            winLength,
        }) as Board.winnerDataType;
        setWinner(winner);
        setHighlightedLine(highlightedLine);
    }, [squares, boardSize, winLength]);

    /** 点击棋盘时的回调 */
    const handleSquareClick = useCallback(
        (index: number) => {
            // 如果有赢家或者已经下过了,就返回
            const { winner } = calculateWinner(squares, (history[currentMove - 1] || Array(squares.length).fill('')), { boardSize, winLength });
            if (
                squares[index] || winner

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
        [squares, history, currentMove]
    );

    return {
        winner,
        boardSize,
        squares,
        highlightedLine,
        handleSquareClick,
    };
}
