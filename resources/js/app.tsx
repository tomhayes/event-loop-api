import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    if (container) {
        const root = createRoot(container);
        root.render(React.createElement(App));
    } else {
        console.error('Could not find #app element');
    }
});