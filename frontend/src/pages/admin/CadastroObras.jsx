import React, { useState } from "react";

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

    // Atualiza o estado dos campos do formulário
    const handleChange = (e) => {
        setObra({ ...obra, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Antes de enviar, converta os campos para o formato correto
        const obraValidada = {
            titulo: obra.titulo,
            artistas: obra.artistas.split(",").map(artista => artista.trim()), // Converte o campo de artistas em uma lista
            descricao: obra.descricao,
            localizacao: obra.localizacao,
            ano: parseInt(obra.ano), // Certifique-se de enviar como número
            video_url: obra.video_url,
            audio_url: obra.audio_url,
            imagens_url: obra.image_url ? [obra.image_url] : [], // Converte URL da imagem para uma lista
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
                console.error("Erro ao cadastrar obra:", errorData);
                alert("Erro ao cadastrar a obra.");
            }
        } catch (error) {
            console.error("Erro ao fazer a solicitação:", error);
            alert("Erro na comunicação com o servidor.");
        }
    };

    return (
        <div>
            <h1>Cadastrar Nova Obra</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="titulo"
                    placeholder="Título"
                    value={obra.titulo}
                    onChange={handleChange}
                    required
                />
                <input
                    name="artistas"
                    placeholder="Autores (separados por vírgula)"
                    value={obra.artistas}
                    onChange={handleChange}
                    required
                />
                <input
                    name="ano"
                    placeholder="Ano"
                    value={obra.ano}
                    onChange={handleChange}
                    required
                />
                <input
                    name="localizacao"
                    placeholder="Localização"
                    value={obra.localizacao}
                    onChange={handleChange}
                    required
                />
                <input
                    name="descricao"
                    placeholder="Descrição"
                    value={obra.descricao}
                    onChange={handleChange}
                    required
                />
                <input
                    name="video_url"
                    placeholder="URL do vídeo"
                    value={obra.video_url}
                    onChange={handleChange}
                    required
                />
                <input
                    name="image_url"
                    placeholder="URL da Imagem"
                    value={obra.image_url}
                    onChange={handleChange}
                    required
                />
                <input
                    name="audio_url"
                    placeholder="URL do Áudio"
                    value={obra.audio_url}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastroObras;
