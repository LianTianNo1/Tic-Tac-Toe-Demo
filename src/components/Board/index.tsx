import React from 'react';
import { useBoard } from 'hooks';
import { BoardProps } from 'hooks/useBoard';

/** 定义棋盘Board组件 */
export default function Board (props: BoardProps) {
    const {  status, board } = useBoard(props);

    // 返回棋盘组件
    return (
        <React.Fragment>
            <div className="status">{status}</div>
            {board}
        </React.Fragment>
    );
}
