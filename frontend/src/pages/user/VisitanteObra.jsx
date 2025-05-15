import React, { useEffect, useState, useRef } from "react";
import '../../style/VisitanteObra.css';
import {
  HandLandmarker,
  FilesetResolver
} from '@mediapipe/tasks-vision';
import HandDetector from "../../components/HandDetector"


const DISTANCIA_MIN = 20;
const DISTANCIA_MAX = 30;
const TEMPO_NECESSARIO_MS = 5000;
const ID_OBRA = "67e0adad46e5b921c4a270d9";

function VisitanteObra() {
    const [distancia, setDistancia] = useState(null);
    const [obra, setObra] = useState(null);
    const [contadorAtivo, setContadorAtivo] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(TEMPO_NECESSARIO_MS / 1000);
    const [obraExibida, setObraExibida] = useState(false);
    const [dentro, setDentro] = useState(false);

    const intervaloRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        intervaloRef.current = setInterval(verificarDistancia, 1000);
        return () => {
            clearInterval(intervaloRef.current);
            cancelarContagem();
        };
    }, []);

    useEffect(() => {
        const verificarMaoFechada = setInterval(async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/exibicao/status-mao");
                const data = await res.json();

                if (data.closed_hand && obra && obraExibida) {
                    speakText(obra.descricao);
                }
            } catch (error) {
                console.error("Erro ao verificar mão fechada:", error);
            }
        }, 2000); // Checa a cada 2 segundos

        return () => clearInterval(verificarMaoFechada);
    }, [obra, obraExibida]);

    const handleFistDetected = async () => {
        try {
        await fetch("http://localhost:8000/exibicao/detectar-mao-fechada", {
            method: "POST",
        });
        } catch (err) {
        console.error("Erro ao enviar mão fechada:", err);
        }
    };

    const verificarDistancia = async () => {
        try {
            const d = await buscarDistancia();
            setDistancia(d);

            const dentroDaFaixa = estaDentroDaFaixa(d);

            if (dentroDaFaixa && !contadorAtivo && !obraExibida) {
                setContadorAtivo(true);
                iniciarContagem();
                setDentro(true);
            }

            if (!dentroDaFaixa) {
                if (contadorAtivo) {
                    cancelarContagem();
                }

                if (obraExibida) {
                    resetarObra();
                }

                setDentro(false);
            }


            if (!dentroDaFaixa && obraExibida) {
                resetarObra();
            }
        } catch (err) {
            console.error("Erro ao buscar distância:", err);
        }
    };

    const buscarDistancia = async () => {
        const res = await fetch("http://localhost:8000/exibicao/distance");
        const data = await res.json();
        return parseFloat(data.distancia);
    };

    const estaDentroDaFaixa = (d) => d >= DISTANCIA_MIN && d <= DISTANCIA_MAX;

    const iniciarContagem = () => {
        let segundos = TEMPO_NECESSARIO_MS / 1000;
        setTempoRestante(segundos);

        timeoutRef.current = setInterval(() => {
            segundos -= 1;
            setTempoRestante(segundos);
            if (segundos <= 0) finalizarContagem();
        }, 1000);
    };

    const finalizarContagem = async () => {
        clearInterval(timeoutRef.current);
        setContadorAtivo(false);
        setTempoRestante(0);

        try {
            const obraSelecionada = await buscarObraPorId(ID_OBRA);
            if (obraSelecionada) {
                setObra(obraSelecionada);
                setObraExibida(true);
            }
        } catch (err) {
            console.error("Erro ao buscar obra:", err);
        }
    };

    const buscarObraPorId = async (id) => {
        const res = await fetch("http://localhost:8000/admin/obras");
        const obras = await res.json();
        return obras.find((o) => o._id === id);
    };

    const cancelarContagem = () => {
        clearInterval(timeoutRef.current);
        setContadorAtivo(false);
        setTempoRestante(TEMPO_NECESSARIO_MS / 1000);
        setObra(null);
    };

    const resetarObra = () => {
        setObra(null);
        setObraExibida(false);
        setContadorAtivo(false);
        setTempoRestante(TEMPO_NECESSARIO_MS / 1000);
    };


    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="visitante-container">
            <h1 className="titulo">Modo Visitante</h1>

            {!obraExibida && dentro && (
                <p className="distancia">Distância: {distancia !== null ? `${distancia} cm` : "Aguardando..."}</p>
            )}

            {contadorAtivo && !obraExibida && (
                <p className="aguarde-msg">Aguarde {tempoRestante} segundos para visualizar a obra...</p>
            )}

            {/* Debug */}
            {/* <p className="distancia">contadorAtivo: {`${contadorAtivo}`}</p>
            <p className="distancia">obraExibida: {`${obraExibida}`}</p>
            <p className="distancia">dentroFaixa: {`${dentro}`}</p>
            <p className="distancia">obra: {obra ? "Carregada" : "Nula"}</p> */}

            {(distancia <= 100) && obra && obraExibida ? (
                <div className="obra-card">
                    <div className="obra-imagem">
                        <img src={obra.imagens_url} alt="Imagem da Obra" />
                    </div>
                    <div className="obra-info">
                        <h2 className="obra-titulo">{obra.titulo}</h2>
                        <p className="obra-meta">{obra.artistas?.join(", ")} • {obra.ano}</p>
                        <div className="descricao">
                            <h3>Descrição</h3>
                            <p>{obra.descricao}</p>
                            <button className="botao-ouvir" onClick={() => speakText(obra.descricao)}>
                                Ouvir Descrição
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="proximidade-msg">Aproxime-se da obra para iniciar a visita.</p>
            )}
            {/* <HandDetector onFistDetected={handleFistDetected} /> */}
        </div>
                

    );
}

export default VisitanteObra;
