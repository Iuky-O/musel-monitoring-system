// components/ListaVisitas.jsx

import React, { useState, useEffect } from 'react';

const ListaVisitas = () => {
  const [visitas, setVisitas] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/admin/visitas");
        const data = await response.json();
        setVisitas(data);
      } catch (error) {
        console.error("Erro ao buscar visitas:", error);
      }
    };

    fetchVisitas();
  }, []);

  const visitasFiltradas = visitas.filter((v) =>
    v.id_obra.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2>Lista de Visitas por Obra</h2>
      <input
        type="text"
        placeholder="Buscar por ID da obra..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID da Obra</th>
            <th>Nome da Obra</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {visitasFiltradas.map((visita) => (
            <tr key={visita._id}>
              <td>{visita.id_obra}</td>
              <td>{visita.nome_obra}</td>
              <td>{visita.numero_visitas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaVisitas;
