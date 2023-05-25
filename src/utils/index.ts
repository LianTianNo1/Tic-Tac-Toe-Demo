interface CalculateWinnerArgs {
  boardSize: number;
  winLength: number;
}

/** 计算赢家的函数 */
export function calculateWinner(
  squares: string[],
  { boardSize, winLength }: CalculateWinnerArgs
) {
  const lines: number[][] = [];

  // 横线
  for (let i = 0; i < boardSize; i++) {
    // 遍历每一行
    for (let j = 0; j < boardSize - winLength + 1; j++) {
      // 从每一行的第一个格子开始,尝试找到长度为winLength的线段
      lines.push([i * boardSize + j, i * boardSize + j + 1]);
      // 首先推入第一和第二个格子到线段
      for (let k = 2; k < winLength; k++) {
        // 然后继续推入第三个、第四个...格子,直到线段长度达到winLength
        lines[lines.length - 1].push(i * boardSize + j + k);
      }
    }
  }

  // 竖线
  for (let i = 0; i < boardSize; i++) {
    // 遍历每一列
    for (let j = 0; j < boardSize - winLength + 1; j++) {
      // 从每一列的第一个格子开始,尝试找到长度为winLength的线段
      lines.push([j * boardSize + i, (j + 1) * boardSize + i]);
      // 首先推入第一和第二个格子到线段
      for (let k = 2; k < winLength; k++) {
        // 然后继续推入第三个、第四个...格子,直到线段长度达到winLength
        lines[lines.length - 1].push((j + k) * boardSize + i);
      }
    }
  }

  // 左上到右下的斜线查找，boardSize - winLength 行结束，从 boardSize - winLength 行开始，斜线长度不足以构成连线
  // +1 是为了包含最后一个能够构成连线的起始位置
  for (let i = 0; i < boardSize - winLength + 1; i++) {
    // j 控制起始列的索引，从第一列开始到 boardSize - winLength 列结束。
    for (let j = 0; j < boardSize - winLength + 1; j++) {
      // 在每个起始位置 (i, j)，创建一个空数组 lines.push([])，用于存储斜线上的方格索引
      lines.push([]);
      for (let k = 0; k < winLength; k++) {
        // k 从 0 到 winLength - 1，计算斜线上每个方格的索引，并将其添加到当前行的数组中。
        // 方格索引通过 (i + k) * boardSize + j + k 计算得到，其中 i + k 表示行索引的偏移量，j + k 表示列索引的偏移量
        lines[lines.length - 1].push((i + k) * boardSize + j + k);
      }
    }
  }

  // 右上到左下的斜线查找
  for (let i = 0; i < boardSize - winLength + 1; i++) {
    //  j 控制起始列的索引，从 winLength - 1 列开始到最后一列。
    for (let j = winLength - 1; j < boardSize; j++) {
      // 创建一个新的空数组，用于存储斜线上的方格索引
      lines.push([]);
      for (let k = 0; k < winLength; k++) {
        // 将斜线上的方格索引添加到当前行中
        lines[lines.length - 1].push((i + k) * boardSize + j - k);
      }
    }
  }

  // 遍历所有可能的胜利线段
  for (let line of lines) {
    // chips数组存储线段上的棋子
    let chips: string[] = [];
    // 遍历线段上的每个格子
    for (let i = 0; i < winLength; i++) {
      // 将每个格子上的棋子推入chips数组
      chips.push(squares[line[i]]);
    }
    // 如果chips数组中的所有棋子都相同(并且不为空),则判定有获胜者
    if (chips.every((chip) => chip === chips[0] && chip != null)) {
      return {
        // 获胜棋子是线段第一个格子上的棋子
        winner: squares[line[0]],
        // 胜利线段
        line,
      };
    }
  }
  // 如果没有获胜线段,则返回null
  return null;
}

/**
 * 计算行列号的函数
 * 变化坐标是在preSquares状态变化到nextSquares状态的过程中产生的
 */
export function calculateRowCol(
  preSquares: string[],
  nextSquares: string[],
  boardSize: number
) {
  // 对preSquares遍历可以确保遍历到的每个坐标,都代表了preSquares状态下的棋子情况。
  for (let i = 0; i < preSquares.length; i++) {
    // 然后再和nextSquares中对应的坐标进行对比,就可以找出变化的坐标
    if (preSquares[i] !== nextSquares[i]) {
      // 计算行号
      const row = Math.floor(i / boardSize) + 1;
      // 计算列号
      const col = (i % boardSize) + 1;
      return `${row}, ${col}`;
    }
  }
}

/** 空白方法 */
export const blockFun = () => {};
