import React, { useEffect, useState } from "react";
import "../../style/ListaObras.css";

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

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h2>Admin</h2>
                <nav>
                    <a href="#">Cadastrar Obras</a>
                    <a href="#">Listar Obras</a>
                    <a href="#">Visitas</a>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Lista de Obras</h1>
                {erro && <p className="erro">{erro}</p>}
                <div className="obras-grid">
                    {obras.map((obra) => (
                        <div className="obra-card" key={obra._id}>
                            <img src={obra.image_url} alt={obra.titulo} />
                            <div className="obra-info">
                                <h2>{obra.titulo}</h2>
                                <p><strong>ID:</strong> {obra._id}</p>
                                <p><strong>Artistas:</strong> {obra.artistas?.join(', ')}</p>
                                <p><strong>Ano:</strong> {obra.ano}</p>
                                <p><strong>Localização:</strong> {obra.localizacao}</p>
                                <p><strong>Descrição:</strong> {obra.descricao}</p>
                                {obra.video_url && (
                                    <video controls src={obra.video_url} className="obra-video" />
                                )}
                                {obra.audio_url && (
                                    <audio controls src={obra.audio_url} className="obra-audio" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default ListaObras;
