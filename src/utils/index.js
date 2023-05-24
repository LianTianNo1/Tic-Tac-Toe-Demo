/** 计算赢家的函数 */
export function calculateWinner(squares) {
    // 组成赢家的所有可能线
    const lines = [
      [0, 1, 2], // 第一行
      [3, 4, 5], // 第二行
      [6, 7, 8], // 第三行
      [0, 3, 6], // 第一列
      [1, 4, 7], // 第二列
      [2, 5, 8], // 第三列
      [0, 4, 8], // 主对角线
      [2, 4, 6], // 次对角线
    ];
  
    // 遍历所有可能线
    for (let i = 0; i < lines.length; i++) {
      // 获取当前线上的坐标
      const [a, b, c] = lines[i];
      // 如果这三个坐标上的棋子都一样,并且都不为空,那么就返回这个棋子
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // 返回赢家的棋子,也返回赢家线上的三个坐标
        return {
          winner: squares[a],
          line: [a, b, c],
        };
      }
    }
    // 如果没有赢家,返回null
    return null;
  }
  
  /**
   * 计算行列号的函数
   * 变化坐标是在preSquares状态变化到nextSquares状态的过程中产生的
   */
  export function calculateRowCol(preSquares, nextSquares) {
    // 对preSquares遍历可以确保遍历到的每个坐标,都代表了preSquares状态下的棋子情况。
    for (let i = 0; i < preSquares.length; i++) {
      // 然后再和nextSquares中对应的坐标进行对比,就可以找出变化的坐标
      if (preSquares[i] !== nextSquares[i]) {
        // 计算行号
        const row = Math.floor(i / 3) + 1;
        // 计算列号
        const col = (i % 3) + 1;
        return `${row}, ${col}`;
      }
    }
  }
