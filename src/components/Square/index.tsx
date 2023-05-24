import React from "react";

interface SquareProps {
  /** 显示值 */
  value: string;
  /** 父类点击事件 */
  onSquareClick: () => void;
  /** 是否高亮 */
  highlight: boolean;
}

/** 定义棋子Square组件 */
export default function Square(props: SquareProps) {
  const { highlight = false, value, onSquareClick } = props;

  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
