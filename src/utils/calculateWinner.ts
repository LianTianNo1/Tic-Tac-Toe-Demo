interface CalculateWinnerArgs {
    boardSize: number;
    winLength: number;
}

/** 计算赢家的函数 */
export default function calculateWinner (
    squares: string[],
    { boardSize, winLength }: CalculateWinnerArgs
) {
    const lines: number[][] = [];

    // 横线
    for (let index = 0; index < boardSize; index++) {
        // 遍历每一行
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 从每一行的第一个格子开始,尝试找到长度为winLength的线段
            lines.push([(index * boardSize) + jIndex, (index * boardSize) + jIndex + 1]);
            // 首先推入第一和第二个格子到线段
            for (let kIndex = 2; kIndex < winLength; kIndex++) {
                // 然后继续推入第三个、第四个...格子,直到线段长度达到winLength
                lines[lines.length - 1].push((index * boardSize) + jIndex + kIndex);
            }
        }
    }

    // 竖线
    for (let index = 0; index < boardSize; index++) {
        // 遍历每一列
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 从每一列的第一个格子开始,尝试找到长度为winLength的线段
            lines.push([(jIndex * boardSize) + index, ((jIndex + 1) * boardSize) + index]);
            // 首先推入第一和第二个格子到线段
            for (let kIndex = 2; kIndex < winLength; kIndex++) {
                // 然后继续推入第三个、第四个...格子,直到线段长度达到winLength
                lines[lines.length - 1].push(((jIndex + kIndex) * boardSize) + index);
            }
        }
    }

    // 左上到右下的斜线查找，boardSize - winLength 行结束，从 boardSize - winLength 行开始，斜线长度不足以构成连线
    // +1 是为了包含最后一个能够构成连线的起始位置
    for (let index = 0; index < boardSize - winLength + 1; index++) {
        // jIndex 控制起始列的索引，从第一列开始到 boardSize - winLength 列结束。
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 在每个起始位置 (index, jIndex)，创建一个空数组 lines.push([])，用于存储斜线上的方格索引
            lines.push([]);
            for (let kIndex = 0; kIndex < winLength; kIndex++) {
                // kIndex 从 0 到 winLength - 1，计算斜线上每个方格的索引，并将其添加到当前行的数组中。
                // 方格索引通过 (index + kIndex) * boardSize + jIndex + kIndex 计算得到，其中 index + kIndex 表示行索引的偏移量，j + kIndex 表示列索引的偏移量
                lines[lines.length - 1].push(((index + kIndex) * boardSize) + jIndex + kIndex);
            }
        }
    }

    // 右上到左下的斜线查找
    for (let index = 0; index < boardSize - winLength + 1; index++) {
        //  jIndex 控制起始列的索引，从 winLength - 1 列开始到最后一列。
        for (let jIndex = winLength - 1; jIndex < boardSize; jIndex++) {
            // 创建一个新的空数组，用于存储斜线上的方格索引
            lines.push([]);
            for (let kIndex = 0; kIndex < winLength; kIndex++) {
                // 将斜线上的方格索引添加到当前行中
                lines[lines.length - 1].push(((index + kIndex) * boardSize) + jIndex - kIndex);
            }
        }
    }

    // 遍历所有可能的胜利线段
    for (const line of lines) {
        // chips数组存储线段上的棋子
        const chips: string[] = [];
        // 遍历线段上的每个格子
        for (let index = 0; index < winLength; index++) {
            // 将每个格子上的棋子推入chips数组
            chips.push(squares[line[index]]);
        }
        // 如果chips数组中的所有棋子都相同(并且不为空),则判定有获胜者
        if (chips.every((chip) => chip === chips[0] && chip !== null)) {
            return {
                // 获胜棋子是线段第一个格子上的棋子
                winner: squares[line[0]],
                // 胜利线段
                highlightedLine: line,
            };
        }
    }
    // 如果没有获胜线段,则返回null
    return null;
}
