import React from 'react';

const ArtworkDetail = ({ artwork }) => {
  return (
    <>
      <h1>{artwork.titulo}</h1>
      <p>{artwork.descricao}</p>
      {artwork.artistas && <p><strong>Artista(s):</strong> {artwork.artistas.join(", ")}</p>}
      {artwork.ano && <p><strong>Ano:</strong> {artwork.ano}</p>}
      {artwork.localizacao && <p><strong>Localização:</strong> {artwork.localizacao}</p>}
      
      <div className="media-container">
        {artwork.imagens_url?.map((img, index) => (
          <img key={index} src={img} alt={artwork.titulo} className="artwork-image" />
        ))}
      </div>
      
      {artwork.audio_url && (
        <audio controls src={artwork.audio_url} className="artwork-audio"></audio>
      )}
      
      {artwork.video_url && (
        <video controls className="artwork-video">
          <source src={artwork.video_url} type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      )}
    </>
  );
};

export default ArtworkDetail;