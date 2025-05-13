import React, { useEffect, useState } from "react";

const DistanciaAtual = () => {
  const [distancia, setDistancia] = useState(null);

  const fetchDistancia = async () => {
    try {
      const res = await fetch("http://192.168.1.25:8000/exibicao/distance");
      const data = await res.json();
      setDistancia(data.distancia);
    } catch (error) {
      console.error("Erro ao buscar distância:", error);
    }
  };

  useEffect(() => {
    const intervalo = setInterval(fetchDistancia, 2000); // Atualiza a cada 2s
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div style={{ padding: "1rem", fontSize: "1.5rem" }}>
      <strong>Distância atual:</strong>{" "}
      {distancia !== null ? `${distancia} cm` : "Carregando..."}
    </div>
  );
};

export default DistanciaAtual;
