import React, { useState } from 'react';
import './index.css';

/* */
interface Item {
    id: number;
    text: string;
}

/** 生成数据 */
const genData: ()=> Item[] = () => {
    const data: Item[] = [];
    for (let index = 0; index < 20; index++) {
        data.push({ id: index + 1, text: `Item ${index + 1}` });
    }
    return data;
};

/** 拖拽组件 */
const DragDropList = () => {
    const [list, setList] = useState<Item []>(genData());

    const [draggedItem, setDraggedItem] = useState<Item | null>();
    const [draggedOverItem, setDraggedOverItem] = useState<Item | null>();
    const [isDragging, setIsDragging] = useState<boolean>(false);

    /**  */
    const handleDragStart = (event: any, item: Item) => {
        setDraggedItem(item);
        setIsDragging(true);
        event.dataTransfer.setData('text/plain', JSON.stringify(item));
    };

    /**  */
    const handleDragEnter = (event: any, item: Item) => {
        setDraggedOverItem(item);
    };

    /**  */
    const handleDragEnd = () => {
        setDraggedItem(null);
        setDraggedOverItem(null);
        setIsDragging(false);
    };

    /**  */
    const handleDrop = (event: any, item: Item) => {
        event.preventDefault();
        const transferredItem = JSON.parse(event.dataTransfer.getData('text/plain'));
        const newList = list.filter((listItem) => listItem.id !== transferredItem.id);

        let index = list.findIndex((listItem) => listItem.id === item.id);
        if (!draggedItem || !draggedOverItem) return;
        if (draggedItem.id === item.id) {
            index = list.findIndex((listItem) => listItem.id === draggedOverItem.id);
        }

        newList.splice(index, 0, transferredItem);
        setList(newList);
    };

    /**  */
    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    /**  */
    const handleScroll = (direction: string) => {
        const container = document.getElementById('container');
        if (direction === 'up') {
            container!.scrollTop -= 100;
        } else if (direction === 'down') {
            container!.scrollTop += 100;
        }
    };

    /**  */
    const getItemStyle = (item: Item) => {
        if (isDragging && item.id === draggedItem?.id) {
            return { border: '1px dashed gray' };
        }
        return undefined;
    };
    /**  */
    const getTransitionStyle = (item: Item) => {
        if (isDragging && item.id === draggedOverItem?.id) {
            return 'dragged-item';
        }
        return undefined;
    };


    return (
        <div>
            <div className="scroll-buttons">
                <button onClick={() => handleScroll('up')}>Scroll Up</button>
                <button onClick={() => handleScroll('down')}>Scroll Down</button>
            </div>
            <div id="container" className="container">
                {list.map((item) => (
                    <div
                        key={item.id}
                        className={`item ${getTransitionStyle(item)}`}
                        draggable
                        onDragStart={(event) => handleDragStart(event, item)}
                        onDragEnter={(event) => handleDragEnter(event, item)}
                        onDragEnd={handleDragEnd}
                        onDrop={(event) => handleDrop(event, item)}
                        onDragOver={handleDragOver}
                        style={getItemStyle(item)}
                    >
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DragDropList;
