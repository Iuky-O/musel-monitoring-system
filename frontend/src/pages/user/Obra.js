import React, { useRef, useEffect, useState } from 'react';

const Obra = () => {
    const videoRef = useRef(null);
    const [obraDetectada, setObraDetectada] = useState(null);

    // Acessar a câmera
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(error => {
                console.error("Erro ao acessar a câmera:", error);
            });
    }, []);

    // Enviar frame para o backend
    const sendFrameToAPI = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const frameBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

        try {
            const response = await fetch("http://127.0.0.1:8000/vision/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ image: frameBase64 })
            });
            const data = await response.json();
            setObraDetectada(data.prediction_pt);
        } catch (error) {
            console.error("Erro ao enviar o frame:", error);
        }
    };

    // Enviar frames periodicamente (1 frame por segundo)
    useEffect(() => {
        const interval = setInterval(sendFrameToAPI, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Interação com a Obra</h1>
            <video ref={videoRef} width="640" height="480" autoPlay muted></video>
            {obraDetectada && (
                <div>
                    <h2>{obraDetectada}</h2>
                    {/* Exibir conteúdo multimídia da obra */}
                    <p>Histórico da obra, biografia do artista, vídeos, etc.</p>
                </div>
            )}
        </div>
    );
};

export default Obra;