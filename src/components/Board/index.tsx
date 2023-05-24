import React from "react";
import Square from "../Square";
import { calculateWinner } from "../../utils/index";

interface BoardProps {
  /** 棋盘大小 */
  boardSize: number;
  /** 连线长度 */
  winLength: number;
  /** 是否X，用来判断X或者O */
  xIsNext: boolean;
  /** 存储棋盘的数据 */
  squares: string[];
  /** 父类的更新历史的方法 */
  onPlay: (squares: string[]) => void;
}

/** 定义棋盘Board组件 */
export default function Board(props: BoardProps) {
  const { boardSize, winLength, xIsNext, squares, onPlay } = props;

  // 计算赢家
  const winnerData = calculateWinner(squares, { boardSize, winLength });
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
  function handleClick(i: number) {
    // 如果有赢家或者已经下过了,就返回
    if (squares[i] || calculateWinner(squares, { boardSize, winLength })) {
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
  const board = Array.from({ length: boardSize }).map(
    (
      _,
      i // 生成boardSize行
    ) => (
      <div key={i} className="board-row">
        {Array.from({ length: boardSize }).map(
          (
            _,
            j // 每行boardSize列
          ) => (
            <Square
              key={i * boardSize + j}
              value={squares[i * boardSize + j]}
              onSquareClick={() => handleClick(i * boardSize + j)}
              highlight={(line as number[]).includes(i * boardSize + j)} // 高亮square
            />
          )
        )}
      </div>
    )
  );

  // 返回棋盘组件
  return (
    <React.Fragment>
      <div className="status">{status}</div>S{board}
    </React.Fragment>
  );
}
