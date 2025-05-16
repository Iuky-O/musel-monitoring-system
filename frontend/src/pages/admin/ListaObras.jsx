import React, { useEffect, useState } from "react";
import "../../style/ListaObras.css";
import { Link } from "react-router-dom";

function ListaObras() {
    const [obras, setObras] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/admin/obras")
            .then((response) => response.json())
            .then((data) => setObras(data))
            .catch((error) => {
                console.error(error);
                setErro("Erro ao carregar obras.");
            });
    }, []);
    
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
        const voices = window.speechSynthesis.getVoices();
        console.log(voices);
    };


    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h2>Admin</h2>
                <nav>
                    <Link to="/user/obra">Dashboard</Link>
                    <Link to="/admin/cadastro">Cadastrar Obra</Link>
                    <Link to="/admin/lista">Lista de Obras</Link>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Lista de Obras</h1>
                {erro && <p className="erro">{erro}</p>}
                <div className="obras-grid">
                    {obras.map((obra) => (
                        <div className="obra-card" key={obra._id}>
                            {/* <h2 className="obra-titulo">{obra.titulo}</h2> */}

                            <div className="obra-imagem-container">
                                <h2 className="obra-titulo">{obra.titulo}</h2>
                                <img src={obra.imagens_url} alt={obra.titulo} />
                                
                                
                                <div className="obra-info">
                                    {/* <h2>{obra.titulo}</h2> */}
                                    <p><strong>ID:</strong> {obra._id}</p>
                                    <p><strong>Artistas:</strong> {obra.artistas?.join(', ')}</p>
                                    <p><strong>Ano:</strong> {obra.ano}</p>
                                    <p><strong>Localização:</strong> {obra.localizacao}</p>
                                    <p><strong>Descrição:</strong> {obra.descricao}</p>
                                </div>

                                <div>
                                    <button className="botao-ouvir" onClick={() => speakText(obra.descricao)}>
                                        Ouvir Descrição
                                    </button>
                                    {obra.video_url && (
                                        <video controls src={obra.video_url} className="obra-video" />
                                    )}
                                    {obra.audio_url && (
                                        <audio controls src={obra.audio_url} className="obra-audio" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ListaObras;
