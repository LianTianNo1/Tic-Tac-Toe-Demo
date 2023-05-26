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
    // 第一个外部循环(index)用于遍历每一行，从第一行开始。起始值为 0，最大值为 boardSize - 1，这是因为列的索引从 0 开始
    for (let index = 0; index < boardSize; index++) {
        // 第二个内部循环(jIndex)用于遍历每一行中可能的起始格子，从第一个格子开始，直到可以形成长度为winLength的线段的最后一个起始格子。
        // boardSize - winLength + 1表示了从当前行的起始格子开始，直到可以形成长度为winLength的线段的最后一个起始格子。这是因为如果起始格子在最后winLength个格子之前，无法形成长度为winLength的线段。
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 在内部循环中，我们首先将当前起始格子和下一个格子的索引推入lines数组中，这是一个横线线段的起始和结束格子。
            // (index * boardSize) + jIndex表示当前行的起始格子的索引。
            // (index * boardSize) + jIndex + 1表示当前行的下一个格子的索引。
            lines.push([(index * boardSize) + jIndex, (index * boardSize) + jIndex + 1]);
            // 使用一个额外的循环(kIndex)来继续推入线段中的其他格子的索引，直到线段的长度达到winLength。
            // 在内部循环中，kIndex从2开始，因为已经将第一个格子和第二个格子推入线段，所以需要从第三个格子开始。
            for (let kIndex = 2; kIndex < winLength; kIndex++) {
                // (index * boardSize) + jIndex + kIndex表示线段中下一个格子的索引
                // index * boardSize：这部分计算确定行索引在一维数组中的偏移量。由于每行有 boardSize 个格子，将行索引乘以 boardSize 可以得到行索引在一维数组中所占的位置
                // 加起始列索引 jIndex ，得到当前格子在一维数组中的起始位置，将上一步得到的起始位置与当前迭代的索引 kIndex 相加，得到最终的方格索引。
                lines[lines.length - 1].push((index * boardSize) + jIndex + kIndex);
            }
        }
    }

    // 竖线
    // 遍历每一列
    for (let index = 0; index < boardSize; index++) {
        // 可以遍历每一列的起始行。起始值为 0，最大值为 boardSize - winLength，这是因为能够找到长度为 winLength 的线段，
        // 而线段的结束行索引为起始行索引加上 winLength - 1。所以我们需要确保起始行索引不会超过 boardSize - winLength，
        // 从每一列的第一个格子开始,尝试找到长度为winLength的线段
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 首先推入第一和第二个格子到线段,作为线段的起始。
            lines.push([(jIndex * boardSize) + index, ((jIndex + 1) * boardSize) + index]);
            // 然后继续推入第三个、第四个...格子,直到线段长度达到winLength
            for (let kIndex = 2; kIndex < winLength; kIndex++) {
                // (jIndex + kIndex)：这部分计算确定竖线上当前格子的行索引偏移量, 乘以 boardSize，得到当前格子在整个棋盘中所占的行数 +index得到最终的方格索引
                lines[lines.length - 1].push(((jIndex + kIndex) * boardSize) + index);
            }
        }
    }

    // 左上到右下的斜线查找，boardSize - winLength 行结束，从 boardSize - winLength 行开始，斜线长度不足以构成连线
    for (let index = 0; index < boardSize - winLength + 1; index++) {
        // jIndex 控制起始列的索引，从第一列开始到 boardSize - winLength 列结束。
        for (let jIndex = 0; jIndex < boardSize - winLength + 1; jIndex++) {
            // 在每个起始位置 (index, jIndex)，创建一个空数组 lines.push([])，用于存储斜线上的方格索引
            lines.push([]);
            for (let kIndex = 0; kIndex < winLength; kIndex++) {
                // kIndex 从 0 到 winLength - 1，计算斜线上每个方格的索引，并将其添加到当前行的数组中。
                // 方格索引通过 (index + kIndex) * boardSize + jIndex + kIndex 计算得到， index + kIndex 表示行索引的偏移量， 乘 boardSize 计算得到行索引偏移量在一维数组中的位置，
                // jIndex + kIndex 表示列索引的偏移量，加起来得到最后的位置
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
                // 将斜线上的方格索引添加到当前行中,jIndex - kIndex 表示列索引的偏移量，用于确定当前方格在斜线上的列位置
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
