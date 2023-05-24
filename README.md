#入职任务
实现一个井字棋游戏，可参考 https://zh-hans.reactjs.org/learn/tutorial-tic-tac-toe# 要求如下：

扩展
For the current move only, show “You are at move #…” instead of a button.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
Display the location for each move in the format (row, col) in the move history list.

额外：

1. 游戏可配置，支持快速拓展为五子棋（5 子）等等
2. 胜利逻辑使用逻辑运算，而非示例中穷举
3. 拆分组件
4. 使用项目统一 Eslint 规则（npm 全局安装 ezeslint 包，然后在项目目录下直接执行 ezeslint ，选择对应选项即可）
5. 使用 typescript
