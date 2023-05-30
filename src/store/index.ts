import { createStore } from 'redux';
import reducer from './reducers';
// 安装redux-devtools-extension的可视化工具。
import { composeWithDevTools } from 'redux-devtools-extension';

// 创建 store
const store = createStore(reducer, composeWithDevTools());

export default store;

