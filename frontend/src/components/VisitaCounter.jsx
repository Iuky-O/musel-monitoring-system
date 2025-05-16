import React, { useState, useEffect } from 'react';

const VisitaCounter = ({ obraId }) => {
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Busca o contador atual
    const fetchInitialCount = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/visitas/${obraId}`);
        const data = await response.json();
        setCount(data.numero_visitas || 0);
      } catch (error) {
        console.error("Erro ao buscar contador:", error);
      }
    };

    fetchInitialCount();

    // Configura o WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/ws');
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'visita_update' && message.id_obra === obraId) {
        setCount(message.count);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, [obraId]);

  return (
    <div>
      <h3>Visitas: {count}</h3>
    </div>
  );
};

export default VisitaCounter;