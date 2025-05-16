import React from 'react';
import VisitaCounter from '../../components/VisitaCounter';
import ListaVisitas from '../../components/ListaVisitas';
import EstatisticasVisitas from "../../components/EstatisticasVisitas";
import ExportarDados from '../../components/ExportarDados';
import GraficosEstatisticas from '../../components/GraficosEstatisticas';
import { Link } from "react-router-dom";

const Obra = () => {
  // Supondo que você tenha o ID da obra disponível
  const obraId = "67e0adad46e5b921c4a270d9"; // Substitua pelo ID real

  return (
    <div className="admin-container">
      <aside className="sidebar">
          <h2>Administrado</h2>
          <nav>
              <Link to="/user/obra">Dashboard</Link>
              <Link to="/admin/cadastro">Cadastrar Obra</Link>
              <Link to="/admin/lista">Lista de Obras</Link>
          </nav>
      </aside>
      <main className="main-content">
        <h1>Detalhes da Obra</h1>
        <ExportarDados />
        
        <hr style={{ margin: "20px 0" }} />

        <ListaVisitas />

        <hr style={{ margin: "20px 0" }} />

        <EstatisticasVisitas />

        <hr style={{ margin: "20px 0" }} />
        
        <GraficosEstatisticas />
      </main>
    </div>
  );
};

export default Obra;