import { useEffect, useState, useRef } from "react";

function Home() {
    const [sensorData, setSensorData] = useState({
        distance: null,
        presence: false,
        id_obra: null
    });
    const [visits, setVisits] = useState(0);
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

    return (
<<<<<<< HEAD
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
=======
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            {artwork ? (
                <>
                    <h1>{artwork.title}</h1>
                    <p>{artwork.description}</p>
                    <img src={artwork.image_url} alt={artwork.title} style={{ width: "300px" }} />
                    <audio controls src={artwork.audio_url}></audio>
                </>
            ) : (
                <p>Aproxime-se de uma obra para saber mais!</p>
            )}
>>>>>>> b4c9ba0d47460a0213c5da4977bcb13c75ce43a4
        </div>
    );
}

export default Home;

<<<<<<< HEAD
// import { useEffect, useState } from "react";

// function Home() {
//     const [artwork, setArtwork] = useState(null);
//     const socket = useRef(null); // Usar ref para garantir uma única instância do WebSocket

//     useEffect(() => {
//         // Criar a conexão WebSocket apenas uma vez
//         socket.current = new WebSocket("ws://localhost:8000/ws");

//         socket.current.onmessage = (event) => {
//             setArtwork(JSON.parse(event.data));
//         };

//         return () => {
//             socket.current.close(); // Fechar o WebSocket quando o componente for desmontado
//         };
//     }, []); // O array de dependências vazio garante que isso aconteça apenas uma vez

//     return (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//             {artwork ? (
//                 <>
//                     <h1>{artwork.title}</h1>
//                     <p>{artwork.description}</p>
//                     <img src={artwork.image_url} alt={artwork.title} style={{ width: "300px" }} />
//                     <audio controls src={artwork.audio_url}></audio>
//                 </>
//             ) : (
//                 <p>Aproxime-se de uma obra para saber mais!</p>
//             )}
//         </div>
//     );
// }

// export default Home;
=======
>>>>>>> b4c9ba0d47460a0213c5da4977bcb13c75ce43a4
