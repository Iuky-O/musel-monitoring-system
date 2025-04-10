import React from 'react';
import { Link } from "react-router-dom";
import DistanciaAtual from "../../components/DistanciaAtual"; // ajuste o caminho se necessário

function AdminDashboard() {
    return (
        <div>
            <h1>Painel Administrativo</h1>

            {/* Bloco que mostra a distância vinda do ESP32 */}
            <DistanciaAtual />

            <nav>
                <ul>
                    <li><Link to="/admin/cadastro">Cadastrar Obra</Link></li>
                    <li><Link to="/admin/lista">Lista de Obras</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminDashboard;
