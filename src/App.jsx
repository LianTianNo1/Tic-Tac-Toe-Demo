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
  // useState hook 定义xIsNext和history状态
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);

  // 获取当前棋盘状态
  const currentSquares = history[history.length - 1];

  // 点击棋盘时的回调,更新history和xIsNext
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  // 返回游戏组件
  return (
    <div className="game">
      <div className="game-board">
        {/* 将状态传入Board组件 */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol> {/* 显示历史记录*/}
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
