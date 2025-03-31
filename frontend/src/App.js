import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Obra from './pages/user/Obra';
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CadastroObras from "./pages/admin/CadastroObras.jsx";
import ListaObras from "./pages/admin/ListaObras.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/cadastro" element={<CadastroObras />} />
                <Route path="/admin/lista" element={<ListaObras />} />
                <Route path="/user/obra" element={<Obra />} />
            </Routes>
        </Router>
    );
};

export default App;