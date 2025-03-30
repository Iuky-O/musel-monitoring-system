import React, { useState, useEffect } from 'react';
import useWebSocket from "../../hook/useWebSocket";
import ArtworkDetail from "../../componets/ArtworkDetail";

function Home() {
    const [artwork, setArtwork] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const { loading, error } = useWebSocket("ws://127.0.0.1:8000/ws", (data) => {
        if (data?.presence && data?.id_obra) {
            fetchArtworkDetails(data.id_obra);
        }
    });

    // Função para falar os detalhes da obra
    const speakArtwork = (artworkData) => {
        if (!artworkData || !window.speechSynthesis) return;
        
        window.speechSynthesis.cancel();
        
        const textToSpeak = `
            Obra número: ${artworkData._id || 'não identificada'}.
            Título: ${artworkData.titulo || 'Sem título'}.
            Artista(s): ${Array.isArray(artworkData.artistas) ? artworkData.artistas.join(', ') : artworkData.artistas || 'Artista desconhecido'}.
            Ano: ${artworkData.ano || 'Ano desconhecido'}.
            Localização: ${artworkData.localizacao || 'Localização não informada'}.
            Descrição: ${artworkData.descricao || 'Esta obra não possui descrição.'}
            ${artworkData.video_url ? 'Esta obra possui um vídeo complementar.' : ''}
            ${artworkData.image_url ? 'Esta obra possui uma imagem para visualização.' : ''}
            ${artworkData.audio_url ? 'Esta obra possui um áudio complementar.' : ''}
        `;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (artwork) {
            speakArtwork(artwork);
        }
        
        return () => {
            window.speechSynthesis && window.speechSynthesis.cancel();
        };
    }, [artwork]);

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
            window.speechSynthesis && window.speechSynthesis.cancel();
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="artwork-container">
            {loading && <p>Conectando ao WebSocket...</p>}
            {error && <p className="error">Erro na conexão WebSocket!</p>}
            
            {isFetching ? (
                <div className="loading">
                    <p>Carregando detalhes da obra...</p>
                </div>
            ) : artwork ? (
                <>
                    <div className="artwork-display">
                        <h2>{artwork._id}</h2>
                        <h2>{artwork.titulo}</h2>
                        <h3>{artwork.artistas}</h3>
                        <p>{artwork.ano}</p>
                        <p>{artwork.descricao}</p>
                        <p>{artwork.localizacao}</p>
                        {artwork.video_url && <video controls src={artwork.video_url}></video>}
                        {artwork.image_url && <img src={artwork.image_url} alt={artwork.titulo} style={{ width: "150px" }} />}
                        {artwork.audio_url && <audio controls src={artwork.audio_url}></audio>}
                    </div>
                    
                    <div className="voice-controls" style={{ marginTop: '20px' }}>
                        <button 
                            onClick={() => speakArtwork(artwork)} 
                            disabled={isSpeaking}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isSpeaking ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            {isSpeaking ? 'Reproduzindo...' : '🔊 Ouvir Descrição'}
                        </button>
                        <button 
                            onClick={() => window.speechSynthesis.cancel()}
                            disabled={!isSpeaking}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: !isSpeaking ? '#ccc' : '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ⏹ Parar
                        </button>
                    </div>
                </>
            ) : (
                <p className="empty-message">Aproxime-se de uma obra para saber mais!</p>
            )}
        </div>
    );
}

export default Home;