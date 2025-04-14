import { useEffect, useState, useRef } from "react";

function Home() {
    const [sensorData, setSensorData] = useState({
        distance: null,
        presence: false,
        id_obra: null
    });
    const [visits, setVisits] = useState(0);
    const [artwork, setArtwork] = useState(null); // novo estado para obra
    const socket = useRef(null);

    useEffect(() => {
        // Configurar conexão WebSocket
        socket.current = new WebSocket("ws://127.0.0.1:8000/ws");

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "sensor_data") {
                setSensorData({
                    distance: data.distance,
                    presence: data.presence,
                    id_obra: data.id_obra
                });
            } else if (data.type === "visita_update") {
                setVisits(data.count);
            }
        };

        socket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);

    // Buscar dados da obra quando o ID for detectado
    useEffect(() => {
        if (sensorData.id_obra) {
            fetch(`http://localhost:8000/api/obras/${sensorData.id_obra}`)
                .then(res => res.json())
                .then(data => setArtwork(data))
                .catch(err => console.error("Erro ao buscar obra:", err));
        }
    }, [sensorData.id_obra]);

    return (
        <div style={{
            textAlign: "center",
            marginTop: "50px",
            padding: "20px",
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ color: "#343a40" }}>Monitoramento de Obra de Arte</h1>

            <div style={{
                margin: "30px 0",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #dee2e6"
            }}>
                <h2 style={{ color: "#495057" }}>Dados do Sensor</h2>

                {sensorData.distance !== null ? (
                    <>
                        <div style={{
                            margin: "15px 0",
                            fontSize: "18px"
                        }}>
                            <strong>Distância:</strong> {sensorData.distance} cm
                        </div>

                        <div style={{
                            padding: "10px",
                            backgroundColor: sensorData.presence ? "#28a745" : "#dc3545",
                            color: "white",
                            borderRadius: "5px",
                            margin: "15px 0",
                            fontWeight: "bold"
                        }}>
                            {sensorData.presence ? "PESSOA DETECTADA" : "NENHUMA PESSOA"}
                        </div>

                        <div style={{
                            margin: "15px 0",
                            fontSize: "18px"
                        }}>
                            <strong>Visitas registradas:</strong> {visits}
                        </div>

                        {sensorData.id_obra && (
                            <div style={{
                                marginTop: "20px",
                                fontSize: "14px",
                                color: "#6c757d"
                            }}>
                                ID da Obra: {sensorData.id_obra}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        padding: "20px",
                        color: "#6c757d"
                    }}>
                        Aguardando dados do sensor...
                    </div>
                )}
            </div>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                {artwork ? (
                    <>
                        <h1>{artwork.title}</h1>
                        <p>{artwork.description}</p>
                        <img
                            src={artwork.image_url}
                            alt={artwork.title}
                            style={{ width: "300px" }}
                        />
                        <audio controls src={artwork.audio_url}></audio>
                    </>
                ) : (
                    <p>Aproxime-se de uma obra para saber mais!</p>
                )}
            </div>
        </div>
    );
}

export default Home;
