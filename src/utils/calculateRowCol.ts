/**
 * 计算行列号的函数
 * 变化坐标是在preSquares状态变化到nextSquares状态的过程中产生的
 */
export default function calculateRowCol (
    preSquares: string[],
    nextSquares: string[],
    boardSize: number
) {
    // 对preSquares遍历可以确保遍历到的每个坐标,都代表了preSquares状态下的棋子情况。
    for (let index = 0; index < preSquares.length; index++) {
    // 然后再和nextSquares中对应的坐标进行对比,就可以找出变化的坐标
        if (preSquares[index] !== nextSquares[index]) {
            // 计算行号
            const row = Math.floor(index / boardSize) + 1;
            // 计算列号
            const col = (index % boardSize) + 1;
            return `${row}, ${col}`;
        }
    }
}
