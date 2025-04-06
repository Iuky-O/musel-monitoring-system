import React, { useEffect, useState } from "react";

function ListaObras() {
    const [obras, setObras] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/admin/obras")
            .then(response => response.json())
            .then(data => setObras(data))
            .catch(error => setErro("Erro ao carregar obras"));
    }, []);

    return (
        <div>
            <h1>Lista de Obras</h1>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <ul>
                {obras.map((obra) => (
                    <li key={obra._id}>
                        <h2>{obra._id}</h2>
                        <h2>{obra.titulo}</h2>
                        <h3>{obra.artistas}</h3>
                        <p>{obra.ano}</p>
                        <p>{obra.descricao}</p>
                        <p>{obra.localizacao}</p>
                        <video controls src={obra.video_url}></video>
                        <img src={obra.image_url} alt={obra.title} style={{ width: "150px" }} />
                        <audio controls src={obra.audio_url}></audio>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaObras;
