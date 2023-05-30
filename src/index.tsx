import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles.css';

class MainApp extends React.Component {
    componentDidMount () {
        /**
         * CLS、FID、FCP、LCP、TTFB
         * LCP (Largest Contentful Paint)：最大内容渲染时间：指的是从用户请求网址到窗口中渲染最大可见内容所需要的事件（最大可见内容通常是图片或者视频，或者大块的文本）
         *
         * FID (First Input Delay):首次输入延迟：指的是从用户首次与网页互动（点击链接、按钮等）到浏览器响应此次互动直接的时间。用于判断网页进入互动状态的时间。
         *
         * CLS (Cumulative Layout Shift) :累计布局偏移：得分范围0-1，指的是网页布局在加载期间的偏移量，0表示没有偏移，1表示最大偏移，这个指标指示用户与网站的交互体验，如果网址在加载过程布局一直跳动，用户体验会很差。比如加载一张图片，但没有大小空白占位，导致图片显示时页面高度跳动。
         *
         * FCP(First Contentful Paint)首次内容绘制，标记浏览器渲染来自 DOM 第一位内容的时间点，内容可能是文本、图像等元素。
         * TTFB (Time to First Byte) 首字节到达的时间点。
         */
        reportWebVitals(console.warn);
    }

    render () {
        return (
            <StrictMode>
                <App />
            </StrictMode>
        );
    }
}

const root = createRoot(document.getElementById('root')!);
root.render(<MainApp />);
