import React, { useCallback, useMemo, useState } from "react";
import { Board, Input } from "components";
import { calculateRowCol } from "utils";

interface GameState {
  boardSize: number;
  winLength: number;
  history: string[][];
  currentMove: number;
  isAscending: boolean;
}

// 默认棋盘大小长度
const DEFAULT_BOARD_SIZE = 6;
// 默认连线长度
const DEFAULT_WIN_LENGTH = 3;
// 默认第0步
const DEFAULT_CURRENT_MOVE = 0;

/** Game组件 */
export default function Game() {
  // 棋盘大小
  const [boardSize, setBoardSize] =
    useState<GameState["boardSize"]>(DEFAULT_BOARD_SIZE);
  // 连线长度
  const [winLength, setWinLength] =
    useState<GameState["winLength"]>(DEFAULT_WIN_LENGTH);
  // useState hook 定义history和currentMove状态
  const [history, setHistory] = useState<GameState["history"]>([
    Array(boardSize * boardSize).fill(null),
  ]);
  const [currentMove, setCurrentMove] =
    useState<GameState["currentMove"]>(DEFAULT_CURRENT_MOVE);

  // 棋盘大小变化
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    setBoardSize(size);
    // 重置历史
    setHistory([Array(size * size).fill(null)]);
    // 重置currentMove
    setCurrentMove(0);
  };

  // 连线长度变化
  const handleWinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const len = Number(e.target.value);
    if (len > boardSize) return console.error("超过范围");
    setWinLength(len);
  };

  // 添加排序标志
  const [isAscending, setIsAscending] = useState(true);
  // 获取当前棋盘状态,从history中取currentMove对应的棋盘状态
  const currentSquares = history[currentMove];

  /**
   * 如果 currentMove 是偶数,则 xIsNext 为 true。
   * 如果 currentMove 是奇数,则 xIsNext 为 false。
   * 所以通过这个简单的计算,我们可以清楚地知道在任何一步,该谁下棋(X或O)。
   */
  const xIsNext = useMemo(() => currentMove % 2 === 0, [currentMove]);

  // 点击棋盘时的回调,更新history和xIsNext
  const handlePlay = useCallback(
    (nextSquares: string[]) => {
      // 获取从history中前currentMove+1步的子数组,并拼接上nextSquares
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      // 更新history和currentMove
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    },
    [boardSize, history]
  );

  // 跳转到history中的某一步
  const jumpTo = useCallback(
    (nextMove: number) => {
      setCurrentMove(nextMove);
    },
    [history]
  );

  // 渲染历史记录列表
  const moves = useMemo(() => {
    return history.map((_, move) => {
      let description;
      // 仅对于当前移动，显示“您正在移动#...”而不是按钮
      if (move === currentMove) {
        description = `您正在移动第${move}步`;
      } else if (move > 0) {
        // 如果不是第一步,显示跳转文字和行列号
        const rowCol = calculateRowCol(
          history[move - 1],
          history[move],
          boardSize
        );
        description = `跳转到第${move}步, 当前坐标 (${rowCol})`;
      } else {
        description = "进入游戏开始";
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
  }, [history]);

  // 根据isAscending排序moves
  // a.key和b.key代表了用于比较排序的键,在这里中就是每个move步数
  const sortedMoves = useMemo(() => {
    return isAscending
      ? moves.slice().sort((a, b) => (a.key as number) - (b.key as number))
      : moves.slice().sort((a, b) => (b.key as number) - (a.key as number));
  }, [isAscending, moves]);

  const toggleSortOrder = useCallback(() => {
    setIsAscending(!isAscending);
  }, [isAscending]);

  // 返回游戏组件
  return (
    <div className="game">
      <div className="game-setting">
        {/* 添加输入框设置棋盘大小和连线长度 */}
        <Input
          type="number"
          value={boardSize}
          onChange={handleBoardSizeChange}
          label={`棋盘大小：{${boardSize}x${boardSize}}`}
        />
        <Input
          type="number"
          value={winLength}
          onChange={handleWinLengthChange}
          label={`连线长度：当前规则${winLength}子棋`}
        />
      </div>

      <div className="game-board">
        <Board
          boardSize={boardSize}
          winLength={winLength}
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        {/* 添加排序按钮 */}
        <button onClick={toggleSortOrder}>
          {isAscending ? "正序" : "倒序"}
        </button>
        {/* 显示排序历史记录*/}
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
