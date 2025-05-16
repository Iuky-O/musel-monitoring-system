// components/GraficosEstatisticas.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const GraficosEstatisticas = () => {
  const [horariosPico, setHorariosPico] = useState([]);
  const [visitasPorDia, setVisitasPorDia] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [horariosRes, visitasRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/estatisticas/horarios-de-pico"),
          fetch("http://127.0.0.1:8000/estatisticas/visitas-por-periodo?periodo=dia"),
        ]);

        const horariosData = await horariosRes.json();
        const visitasData = await visitasRes.json();

        setHorariosPico(horariosData);
        setVisitasPorDia(visitasData);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };

    fetchDados();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Gráficos de Estatísticas</h3>

      <h4>Horários de Pico</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={horariosPico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" label={{ value: 'Hora', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Visitas" />
        </BarChart>
      </ResponsiveContainer>

      <h4 style={{ marginTop: "40px" }}>Visitas por Dia</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visitasPorDia}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" label={{ value: 'Data', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#82ca9d" name="Visitas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficosEstatisticas;
