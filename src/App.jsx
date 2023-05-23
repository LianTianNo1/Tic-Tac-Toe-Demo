import React, { Fragment, useState } from "react";

// 定义棋子Square组件
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 定义棋盘Board组件
function Board({ xIsNext, squares, onPlay }) {
  // 计算赢家
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // 点击棋盘时的回调
  function handleClick(i) {
    // 如果有赢家或者已经下过了,就返回
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    // 根据xIsNext判断该下X棋还是O棋
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // 调用上层Game组件传递的onPlay方法
    onPlay(nextSquares);
  }

  // 返回棋盘组件
  return (
    <Fragment>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </Fragment>
  );
}

// Game组件
export default function Game() {
  // useState hook 定义history和currentMove状态
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // 获取当前棋盘状态,从history中取currentMove对应的棋盘状态
  const currentSquares = history[currentMove];

  /**
   * 如果 currentMove 是偶数,则 xIsNext 为 true。
   * 如果 currentMove 是奇数,则 xIsNext 为 false。
   * 所以通过这个简单的计算,我们可以清楚地知道在任何一步,该谁下棋(X或O)。
   */
  const xIsNext = currentMove % 2 === 0;

  // 点击棋盘时的回调,更新history和xIsNext
  function handlePlay(nextSquares) {
    // 获取从history中前currentMove+1步的子数组,并拼接上nextSquares
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // 更新history和currentMove
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 跳转到history中的某一步
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 渲染历史记录列表
  const moves = history.map((squares, move) => {
    let description;
    // 仅对于当前移动，显示“您正在移动#...”而不是按钮
    if (move === currentMove) {
      description = `You are at move #${move}`;
    } else if (move > 0) {
      // 如果不是第一步,显示跳转文字
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    // 返回历史记录按钮
    return (
      <li key={move}>
        {/* 仅对于当前移动，显示“您正在移动#...”而不是按钮 */}
        {move === currentMove ? (
          description
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  // 返回游戏组件
  return (
    <div className="game">
      <div className="game-board">
        {/* 将状态传入Board组件 */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* 显示历史记录*/}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 计算赢家的函数
function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  // 如果没有赢家,返回null
  return null;
}
