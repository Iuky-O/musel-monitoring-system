// // src/visitante/VisitanteObra.jsx
// import React, { useEffect, useState } from "react";

// function VisitanteObra() {
//     const [distancia, setDistancia] = useState(null);
//     const [obra, setObra] = useState(null);

//     useEffect(() => {
//         const intervalo = setInterval(() => {
//             fetch("http://localhost:8000/distance")
//                 .then(res => res.json())
//                 .then(data => {
//                     const d = parseFloat(data.distancia);
//                     setDistancia(d);

//                     if (d >= 20 && d <= 30) {
//                         fetch("http://localhost:8000/admin/obras")
//                             .then(res => res.json())
//                             .then(obras => {
//                                 const obraAlvo = obras.find(o => o._id === "67e0adad46e5b921c4a270d9");
//                                 setObra(obraAlvo);
//                             });
//                     } else {
//                         setObra(null);
//                     }
//                 })
//                 .catch(err => console.error("Erro ao buscar distância:", err));
//         }, 3000);

//         return () => clearInterval(intervalo);
//     }, []);

//     return (
//         <div>
//             <h1>Modo Visitante</h1>
//             <p>Distância: {distancia !== null ? `${distancia} cm` : "Aguardando leitura..."}</p>

//             {obra ? (
//                 <div>
//                     <h2>{obra.titulo}</h2>
//                     <img src={obra.image_url} alt={obra.title} style={{ width: "300px" }} />
//                     {/* <video controls src={obra.video_url} style={{ width: "400px" }} />
//                     <audio controls src={obra.audio_url} /> */}
//                     <p>{obra.descricao}</p>
//                 </div>
//             ) : (
//                 <p>Aproxime-se para visualizar a obra.</p>
//             )}
//         </div>
//     );
// }

// export default VisitanteObra;

import React, { useEffect, useState, useRef } from "react";

const DISTANCIA_MIN = 20;
const DISTANCIA_MAX = 30;
const TEMPO_NECESSARIO_MS = 5000; // 30 segundos

function VisitanteObra() {
    const [distancia, setDistancia] = useState(null);
    const [obra, setObra] = useState(null);
    const [contadorAtivo, setContadorAtivo] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(TEMPO_NECESSARIO_MS / 1000);

    const intervaloRef = useRef(null);
    const timeoutRef = useRef(null);

    const ID_OBRA = "67e0adad46e5b921c4a270d9";

    useEffect(() => {
        // Função de verificação contínua da distância
        intervaloRef.current = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:8000/exibicao/distance");
                const data = await res.json();
                const d = parseFloat(data.distancia);
                setDistancia(d);

                const dentroDaFaixa = d >= DISTANCIA_MIN && d <= DISTANCIA_MAX;

                if (dentroDaFaixa && !contadorAtivo) {
                    setContadorAtivo(true);
                    iniciarContagem();
                } else if (!dentroDaFaixa && contadorAtivo) {
                    cancelarContagem();
                }

            } catch (err) {
                console.error("Erro ao buscar distância:", err);
            }
        }, 1000); // checar a cada 1 segundo

        return () => {
            clearInterval(intervaloRef.current);
            cancelarContagem();
        };
    }, []);

    const extrairIdDoDrive = (url) => {
        const match = url.match(/\/d\/([^/]+)\//);
        return match ? match[1] : null;
    };

    const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR'; // Português do Brasil
    window.speechSynthesis.speak(utterance);
    };
    
    const iniciarContagem = () => {
        let segundosRestantes = TEMPO_NECESSARIO_MS / 1000;
        setTempoRestante(segundosRestantes);

        timeoutRef.current = setInterval(() => {
            segundosRestantes -= 1;
            setTempoRestante(segundosRestantes);
            if (segundosRestantes <= 0) {
                finalizarContagem();
            }
        }, 1000);
    };

    const finalizarContagem = async () => {
        clearInterval(timeoutRef.current);
        setContadorAtivo(false);
        setTempoRestante(0);

        // Buscar dados da obra
        try {
            const obrasRes = await fetch("http://localhost:8000/admin/obras");
            const obras = await obrasRes.json();
            const obraSelecionada = obras.find(o => o._id === ID_OBRA);
            if (obraSelecionada) setObra(obraSelecionada);
        } catch (err) {
            console.error("Erro ao buscar obra:", err);
        }
    };

    const cancelarContagem = () => {
        clearInterval(timeoutRef.current);
        setContadorAtivo(false);
        setTempoRestante(TEMPO_NECESSARIO_MS / 1000);
        setObra(null);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Modo Visitante</h1>
            <p>Distância: {distancia !== null ? `${distancia} cm` : "Aguardando..."}</p>

            {contadorAtivo && (
                <p>Aguarde {tempoRestante} segundos para visualizar a obra...</p>
            )}

            {obra ? (
                <div style={{ marginTop: 20 }}>
                    <h2>{obra.titulo}</h2>
                    {obra.artistas && obra.artistas.length > 0 ? (
                        <div>
                            {obra.artistas.map((artista, index) => (
                            <p key={index}>{artista}</p>
                            ))}
                        </div>
                        ) : (
                        <p>Artista desconhecido.</p>
                    )}
                    
                    <img src={obra.imagens_url} alt="Imagem da Obra" width="300" />
                    
                    <p>{obra.descricao}</p>
                    <button onClick={() => speakText(obra.descricao)}>Ouvir Descrição</button>
                </div>
            ) : (
                <p>Aproxime-se da obra para iniciar a visita.</p>
            )}
        </div>
    );
}

export default VisitanteObra;
