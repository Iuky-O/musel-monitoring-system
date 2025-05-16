import React, { useState, useEffect } from 'react';

const EstatisticasVisitas = () => {
  const [visitasPorPeriodo, setVisitasPorPeriodo] = useState([]);
  const [horariosDePico, setHorariosDePico] = useState([]);
  const [estatisticasDistancias, setEstatisticasDistancias] = useState({});
  const [historicoPresenca, setHistoricoPresenca] = useState([]);
  const [periodo, setPeriodo] = useState("dia");

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const res1 = await fetch(`http://127.0.0.1:8000/admin/estatisticas/visitas-por-periodo?periodo=${periodo}`);
        const visitasPeriodo = await res1.json();
        setVisitasPorPeriodo(visitasPeriodo);

        const res2 = await fetch("http://127.0.0.1:8000/admin/estatisticas/horarios-de-pico");
        setHorariosDePico(await res2.json());

        const res3 = await fetch("http://127.0.0.1:8000/admin/estatisticas/distancias");
        setEstatisticasDistancias(await res3.json());

        const res4 = await fetch("http://127.0.0.1:8000/admin/estatisticas/historico-presenca");
        setHistoricoPresenca(await res4.json());
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchEstatisticas();
  }, [periodo]);

  return (
    <div>
      <h2>Estatísticas de Visitas</h2>

      <div>
        <label>Período: </label>
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
          <option value="dia">Dia</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
        </select>
      </div>

      <h3>Visitas por {periodo}</h3>
      <ul>
        {visitasPorPeriodo.map((v, i) => (
          <li key={i}>{v._id}: {v.total}</li>
        ))}
      </ul>

      <h3>Horários de Pico</h3>
      <ul>
        {horariosDePico.map((h, i) => (
          <li key={i}>{h._id}: {h.total} visitas</li>
        ))}
      </ul>

      <h3>Distâncias</h3>
      <p><strong>Média:</strong> {estatisticasDistancias.media?.toFixed(2)} cm</p>
      <p><strong>Mínima:</strong> {estatisticasDistancias.minima} cm</p>
      <p><strong>Máxima:</strong> {estatisticasDistancias.maxima} cm</p>

      <h3>Últimas Leituras</h3>
      <ul>
        {historicoPresenca.map((h, i) => (
          <li key={i}>{new Date(h.timestamp).toLocaleString()} - {h.distancia} cm</li>
        ))}
      </ul>
    </div>
  );
};

export default EstatisticasVisitas;
