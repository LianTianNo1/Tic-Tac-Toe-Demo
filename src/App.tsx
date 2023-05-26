import React from 'react';
import { Provider } from 'react-redux';
import { Game } from 'components';
import store from './store';

/** APP入口 */
export default function App () {
    return (<Provider store={store}>
        <Game />
    </Provider>);
}
