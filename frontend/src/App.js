import { ObraProvider } from './hook/ObraContext';
import React from 'react';
import AppRouter from './router/AppRouter.jsx';
const App = () => {
    return (
        <div className="app">
            <ObraProvider>
            <AppRouter />
            </ObraProvider>
        </div>
    );
};

export default App;