import React, { useState, useEffect } from 'react';
import useWebSocket from "../../hook/useWebSocket";
import ArtworkDetail from "../../components/ArtworkDetail";

function Home() {
    const [artwork, setArtwork] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const [sensorData, setSensorData] = useState(null);

    const { loading, error } = useWebSocket("ws://127.0.0.1:8000/ws", (data) => {
        setSensorData(data);
        if (data?.presence && data?.id_obra) {
            fetchArtworkDetails(data.id_obra);
        }
    });
    

    const fetchArtworkDetails = async (id_obra) => {
        setIsFetching(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/obras/${id_obra}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setArtwork(data);
        } catch (error) {
            console.error("Erro ao carregar a obra:", error);
            setArtwork(null);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="artwork-container">
            {sensorData && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>Distância: {sensorData.distance} cm</h3>
                    <p style={{ color: sensorData.presence ? "green" : "red" }}>
                        {sensorData.presence ? "Pessoa detectada" : "Nenhuma pessoa"}
                    </p>
                </div>
            )}

            {loading && <p>Conectando ao WebSocket...</p>}
            {error && <p className="error">Erro na conexão WebSocket!</p>}

            {isFetching ? (
                <div className="loading">
                    <p>Carregando detalhes da obra...</p>
                </div>
            ) : artwork ? (
                <ArtworkDetail artwork={artwork} /> 
            ) : (
                <p className="empty-message">Aproxime-se de uma obra para saber mais!</p>
            )}
        </div>

    );
}

export default Home;