import React, { useEffect, useState, useRef } from "react";
import '../../style/VisitanteObra.css';

const DISTANCIA_MIN = 20;
const DISTANCIA_MAX = 30;
const TEMPO_NECESSARIO_MS = 5000;

function VisitanteObra() {
    const [distancia, setDistancia] = useState(null);
    const [obra, setObra] = useState(null);
    const [contadorAtivo, setContadorAtivo] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(TEMPO_NECESSARIO_MS / 1000);

    const intervaloRef = useRef(null);
    const timeoutRef = useRef(null);
    const ID_OBRA = "67e0adad46e5b921c4a270d9";

    useEffect(() => {
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
        }, 1000);

        return () => {
            clearInterval(intervaloRef.current);
            cancelarContagem();
        };
    }, []);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
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
        <div className="visitante-container">
            <h1 className="titulo">Modo Visitante</h1>
            <p className="distancia">Distância: {distancia !== null ? `${distancia} cm` : "Aguardando..."}</p>

            {contadorAtivo && (
                <p className="aguarde-msg">Aguarde {tempoRestante} segundos para visualizar a obra...</p>
            )}

            {obra ? (
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
        </div>
    );
}

export default VisitanteObra;
