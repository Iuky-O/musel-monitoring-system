import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home/Index.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';  
import CadastroObras from '../pages/admin/CadastroObras.jsx';
import ListaObras from '../pages/admin/ListaObras.jsx';
// import Visao from '../pages/admin/Visao.js';
import Obra from '../pages/user/Obra.js';

const AppRouter = () => {
    console.log("🚀 AppRouter carregado!");
    return (
        
        <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/cadastro" element={<CadastroObras />} />
            <Route path="/admin/lista" element={<ListaObras />} />
            {/* <Route path="/admin/visao" element={<Visao />} /> */}
            <Route path="/user/obra" element={<Obra />} />
        </Routes>
    </Router>
    );
};

export default AppRouter;