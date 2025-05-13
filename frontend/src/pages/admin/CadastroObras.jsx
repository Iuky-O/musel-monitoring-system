import React, { useState } from "react";
import "../../style/CadastroObra.css";

function CadastroObras() {
    const [obra, setObra] = useState({
        titulo: "",
        artistas: "",
        descricao: "",
        localizacao: "",
        ano: "",
        video_url: "",
        audio_url: "",
        image_url: "",
    });

    const handleChange = (e) => {
        setObra({ ...obra, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const obraValidada = {
            titulo: obra.titulo,
            artistas: obra.artistas.split(",").map(artista => artista.trim()),
            descricao: obra.descricao,
            localizacao: obra.localizacao,
            ano: parseInt(obra.ano),
            video_url: obra.video_url,
            audio_url: obra.audio_url,
            imagens_url: obra.image_url ? [obra.image_url] : [],
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/admin/obras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obraValidada),
            });

            if (response.ok) {
                alert("Obra cadastrada com sucesso!");
                setObra({
                    titulo: "",
                    artistas: "",
                    descricao: "",
                    localizacao: "",
                    ano: "",
                    video_url: "",
                    audio_url: "",
                    image_url: "",
                });
            } else {
                const errorData = await response.json();
                alert("Erro ao cadastrar a obra.");
                console.error("Erro ao cadastrar obra:", errorData);
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro na comunicação com o servidor.");
        }
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <h2>Admin</h2>
                <nav>
                    <a href="http://localhost:3000/#/admin/cadastro">Cadastrar Obras</a>
                    <a href="http://localhost:3000/#/admin/lista">Listar Obras</a>
                    <a href="http://localhost:3000/#/user/obra">Visitas</a>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Cadastrar Nova Obra</h1>
                <form className="form-obra" onSubmit={handleSubmit}>
                    <input name="titulo" placeholder="Título" value={obra.titulo} onChange={handleChange} required />
                    <input name="artistas" placeholder="Artistas (separados por vírgula)" value={obra.artistas} onChange={handleChange} required />
                    <input name="ano" placeholder="Ano" value={obra.ano} onChange={handleChange} required />
                    <input name="localizacao" placeholder="Localização" value={obra.localizacao} onChange={handleChange} required />
                    <textarea name="descricao" placeholder="Descrição" value={obra.descricao} onChange={handleChange} required />
                    <input name="video_url" placeholder="URL do Vídeo" value={obra.video_url} onChange={handleChange} />
                    <input name="image_url" placeholder="URL da Imagem" value={obra.image_url} onChange={handleChange} />
                    <input name="audio_url" placeholder="URL do Áudio" value={obra.audio_url} onChange={handleChange} />
                    <button type="submit">Cadastrar</button>
                </form>
            </main>
        </div>
    );
}

export default CadastroObras;
