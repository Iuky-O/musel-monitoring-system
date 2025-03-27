import { useEffect, useState } from "react";

function ListaObras() {
    const [obras, setObras] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/obras")
            .then(response => response.json())
            .then(data => setObras(data));
    }, []);

    return (
        <div>
            <h1>Lista de Obras</h1>
            <ul>
                {obras.map((obra) => (
                    <li key={obra.id}>
                        <h2>{obra.title}</h2>
                        <p>{obra.description}</p>
                        <img src={obra.image_url} alt={obra.title} style={{ width: "150px" }} />
                        <audio controls src={obra.audio_url}></audio>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaObras;
