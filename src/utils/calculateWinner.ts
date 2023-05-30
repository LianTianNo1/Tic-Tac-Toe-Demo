

/** 计算赢家的函数 */
export default function calculateWinner (
    // 棋盘格子的数组
    squares: string[],
    // 上一步的棋盘格子的数组
    preSquares: string[],
    // 参数对象包含棋盘尺寸和胜利条件
    { boardSize, winLength }: Board.CalculateWinnerArgs
) {
    const directions: [number, number][] = [
        [0, 1],     // 右方向
        [1, 0],     // 下方向
        [1, 1],     // 右下方向
        [-1, 1],    // 左下方向
    ];

    // 找到最后一步与上一步不同的棋子位置
    const currentIndex = squares.findIndex((square, index) => square !== preSquares[index]);
    // 当前玩家
    const currentPlayer = squares[currentIndex];
    // 当前棋子的行和列
    const [currentRow, currentCol] = [Math.floor(currentIndex / boardSize), currentIndex % boardSize];

    for (const [dx, dy] of directions) {
        // 存储胜利线上的位置
        const line: number[] = [currentIndex];
        // 计数器，初始为1因为算上自己
        let count = 1;

        // dt=1向一个方向延伸 dt=-1向相反方向延伸
        for (let dt = -1; dt <= 1; dt += 2) {
            for (let step = 1; step < winLength; step++) {
            // 计算新位置的行
                const newRow = currentRow + (step * dt * dx);
                // 计算新位置的列
                const newCol = currentCol + (step * dt * dy);
                // 计算新位置的索引
                const newIndex = (newRow * boardSize) + newCol;

                // 判断新位置是否越界，越界，停止延伸
                if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
                    break;
                }

                if (squares[newIndex] === currentPlayer) {
                    // 新位置上的棋子属于当前玩家，将其添加到胜利线上
                    line.push(newIndex);
                    // 增加计数器的值
                    count++;

                    // 剪枝
                    if (count >= winLength) {
                        return {
                            // 当前玩家获胜
                            winner: currentPlayer,
                            // 胜利线上的位置
                            highlightedLine: line,
                        };
                    }
                } else {
                    // 新位置上的棋子不属于当前玩家，停止延伸
                    break;
                }
            }
        }
    }
    // 没有找到获胜者，返回null
    return  {
        // 当前玩家获胜
        winner: null,
        // 胜利线上的位置
        highlightedLine: [],
    };
}
