import { useEffect, useState } from "react";
import useWebSocket from "../../hook/useWebSocket";
import React from "react";

interface Artwork {
    id?: string;
    titulo?: string;
    artistas?: string[];
    descricao?: string;
    localizacao?: string;
    ano?: number;
    video_url?: string;
    audio_url?: string;
    imagens_url?: string[];
}

interface WebSocketMessage {
    type: string;
    distance?: number;
    presence: boolean;
    id_obra: string;
    error?: string;
}

function Home() {
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const { message, loading, error } = useWebSocket("ws://127.0.0.1:8000/ws", (data: WebSocketMessage) => {
        if (data?.presence && data?.id_obra) {
            fetchArtworkDetails(data.id_obra);
        }
    });

    const fetchArtworkDetails = async (id_obra: string) => {
        setIsFetching(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/obras/${id_obra}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Artwork = await response.json();
            setArtwork(data);
        } catch (error) {
            console.error("Erro ao carregar a obra:", error);
            setArtwork(null);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div >
            {loading && <p>Conectando ao WebSocket...</p>}
            {error && <p>Erro na conexão WebSocket!</p>}
            
            {isFetching ? (
                <div >
                    <p>Carregando detalhes da obra...</p>
                </div>
            ) : artwork ? (
                <>
                    <h1>{artwork.titulo}</h1>
                    <p>{artwork.descricao}</p>
                    {artwork.artistas && <p><strong>Artista(s):</strong> {artwork.artistas.join(", ")}</p>}
                    {artwork.ano && <p><strong>Ano:</strong> {artwork.ano}</p>}
                    {artwork.localizacao && <p><strong>Localização:</strong> {artwork.localizacao}</p>}
                    
                    <div>
                        {artwork.imagens_url?.map((img, index) => (
                            <img key={index} src={img} alt={artwork.titulo}  />
                        ))}
                    </div>
                    
                    {artwork.audio_url && (
                        <audio controls src={artwork.audio_url} ></audio>
                    )}
                    
                    {artwork.video_url && (
                        <video controls >
                            <source src={artwork.video_url} type="video/mp4" />
                            Seu navegador não suporta vídeos.
                        </video>
                    )}
                </>
            ) : (
                <p>Aproxime-se de uma obra para saber mais!</p>
            )}
        </div>
    );
}

export default Home;