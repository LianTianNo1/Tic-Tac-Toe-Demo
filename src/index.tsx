import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles.css';

class MainApp extends React.Component {
    componentDidMount () {
    // You can place any additional logic or side effects here
        reportWebVitals();
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
