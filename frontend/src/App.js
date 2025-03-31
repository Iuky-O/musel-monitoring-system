import React from 'react';
import AppRouter from './router/AppRouter.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Obra from './pages/user/Obra';
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CadastroObras from "./pages/admin/CadastroObras.jsx";
import ListaObras from "./pages/admin/ListaObras.jsx";

const App = () => {
    return (
        <div className="app">
            <AppRouter />
        </div>
    );
};

export default App;