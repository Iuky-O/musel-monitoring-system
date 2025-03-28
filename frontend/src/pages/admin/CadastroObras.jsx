import { useState } from "react";

function CadastroObras() {
    const [obra, setObra] = useState({
        title: "",
        description: "",
        image_url: "",
        audio_url: ""
    });

    const handleChange = (e) => {
        setObra({ ...obra, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/obras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obra),
        });
        if (response.ok) {
            alert("Obra cadastrada com sucesso!");
            setObra({ title: "", description: "", image_url: "", audio_url: "" });
        }
    };

    return (
        <div>
            <h1>Cadastrar Nova Obra</h1>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Título" value={obra.title} onChange={handleChange} required />
                <input name="description" placeholder="Descrição" value={obra.description} onChange={handleChange} required />
                <input name="image_url" placeholder="URL da Imagem" value={obra.image_url} onChange={handleChange} required />
                <input name="audio_url" placeholder="URL do Áudio" value={obra.audio_url} onChange={handleChange} required />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastroObras;
