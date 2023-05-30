import React from 'react';
import { Provider } from 'react-redux';
import { Game } from 'components';
import store from './store';

/** APP入口 */
class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <Game />
            </Provider>
        );
    }
}

export default App;
