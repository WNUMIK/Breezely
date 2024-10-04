import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './global.css'; // Still importing the global reset and utility styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
