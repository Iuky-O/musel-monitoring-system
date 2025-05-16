import React from 'react';
import { Link } from "react-router-dom";
import DistanciaAtual from "../../components/DistanciaAtual";

function AdminDashboard() {
    return (
        <div>
            <h1>Painel Administrativo</h1>
            <nav>
                <ul>
                    <li><Link to="/user/obra">Cadastrar Obra</Link></li>
                    <li><Link to="/admin/cadastro">Cadastrar Obra</Link></li>
                    <li><Link to="/admin/lista">Lista de Obras</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminDashboard;
