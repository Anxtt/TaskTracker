import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import App from './App';

import AuthProvider from './Hooks/useAuth';
import TasksProvider from './Hooks/useTasks';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <TasksProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </TasksProvider>
        </AuthProvider>
    </React.StrictMode>
);