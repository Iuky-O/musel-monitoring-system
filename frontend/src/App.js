import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Visao from './pages/admin/Visao';
import Obra from './pages/user/Obra';
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CadastroObras from "./pages/admin/CadastroObras";
import ListaObras from "./pages/admin/ListaObras";

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/cadastro" element={<CadastroObras />} />
                <Route path="/admin/lista" element={<ListaObras />} />
                <Route path="/admin/visao" element={<Visao />} />
                <Route path="/user/obra" element={<Obra />} />
            </Routes>
        </Router>
    );
};

export default App;