import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Exemplo = () => {
  const [horariosPico, setHorariosPico] = useState([]);
  const [visitasPorDia, setVisitasPorDia] = useState([]);
  const [obraMaisVisitada, setObraMaisVisitada] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [horariosRes, visitasRes, cursosRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/admin/estatisticas/horarios-de-pico"),
          fetch("http://127.0.0.1:8000/admin/estatisticas/visitas-por-periodo?periodo=dia"),
          fetch("http://127.0.0.1:8000/admin/visitas"),
        ]);

        const horariosData = await horariosRes.json();
        const visitasData = await visitasRes.json();
        const obraData = await cursosRes.json(); // Corrigido aqui

        const horariosFormatados = horariosData.map(item => ({
          hora: `${item._id}h`,
          visitas: item.total,
        }));

        const visitasFormatadas = visitasData.map(item => ({
          data: item._id,
          visitas: item.total,
        }));

        const obrasFormatadas = obraData.map(item => ({
          nome: item.nome_obra,
          visitas: item.numero_visitas,
        }));

        setHorariosPico(horariosFormatados);
        setVisitasPorDia(visitasFormatadas);
        setObraMaisVisitada(obrasFormatadas);
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
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visitas" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h4>Visitas por Dia</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={visitasPorDia}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visitas" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h4>Obras Mais Visitadas</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={obraMaisVisitada}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visitas" fill="#8814a0" />
        </BarChart>
      </ResponsiveContainer>

      <div>
        <h5>Horários de Pico:</h5>
        <ul>
          {horariosPico.map((item, index) => (
            <li key={index}>{item.hora} - {item.visitas} visitas</li>
          ))}
        </ul>

        <h5>Visitas por Dia:</h5>
        <ul>
          {visitasPorDia.map((item, index) => (
            <li key={index}>{item.data} - {item.visitas} visitas</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Exemplo;
