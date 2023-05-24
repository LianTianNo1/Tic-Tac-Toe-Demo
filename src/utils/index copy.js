/** 计算赢家的函数 */
export function calculateWinner(squares, { boardSize, winLength }) {
  const lines = [];

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

  // 左上到右下 对角线
  for (let i = 0; i < boardSize - winLength + 1; i++) {
    // 从左上角第一个格子开始,尝试找到长度为winLength的对角线
    for (let j = 0; j <= i; j++) {
      // j <= i说明这是左上到右下的对角线
      lines.push([i * boardSize + j, (i + 1) * boardSize + j + 1]);
      // 首先推入第一和第二个格子到线段
      for (let k = 2; k < winLength; k++) {
        lines[lines.length - 1].push((i + k) * boardSize + j + k);
      }
    }
  }

  // 右上到左下 对角线
  for (let i = winLength - 1; i < boardSize; i++) {
    // 从右上角第一个格子开始,尝试找到长度为winLength的对角线
    for (let j = 0; j < boardSize - i; j++) {
      // j < boardSize - i 说明这是右上到左下的对角线
      lines.push([i * boardSize + j, (i - 1) * boardSize + j + 1]);
      // 首先推入第一和第二个格子到线段
      for (let k = 2; k < winLength; k++) {
        lines[lines.length - 1].push((i - k) * boardSize + j + k);
      }
    }
  }

  // 遍历所有可能的胜利线段
  for (let line of lines) {
    // chips数组存储线段上的棋子
    let chips = [];
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
export function calculateRowCol(preSquares, nextSquares, boardSize) {
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
