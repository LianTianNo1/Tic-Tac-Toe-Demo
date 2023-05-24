import React, { Fragment } from "react";
import Square from "../Square";
import { calculateWinner } from "../../utils/index";

/** 定义棋盘Board组件 */
export default function Board({ xIsNext, squares, onPlay }) {
  // 计算赢家
  const winnerData = calculateWinner(squares);
  const winner = winnerData && winnerData.winner;
  const line = winnerData && winnerData.line;
  let status;

  if (winner) {
    status = "胜利者: " + winner;
  } else if (Array.from(squares).every((sq) => sq != null)) {
    // 如果棋盘上所有格子都不为空
    status = "平局";
  } else {
    status = "下一个回合: " + (xIsNext ? "X" : "O");
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

  // 使用两个循环生成棋盘格子
  const board = Array.from({ length: 3 }).map(
    (
      _,
      i // 生成3行
    ) => (
      <div key={i} className="board-row">
        {Array.from({ length: 3 }).map(
          (
            _,
            j // 每行3列
          ) => (
            <Square
              key={i * 3 + j}
              value={squares[i * 3 + j]}
              onSquareClick={() => handleClick(i * 3 + j)}
              highlight={line && line.includes(i * 3 + j)} // 高亮square
            />
          )
        )}
      </div>
    )
  );

  // 返回棋盘组件
  return (
    <Fragment>
      <div className="status">{status}</div>
      {board}
    </Fragment>
  );
}
