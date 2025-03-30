import { useEffect, useState } from "react";

function Home() {
    const [artwork, setArtwork] = useState(null);
    const socket = new WebSocket("ws://localhost:8000/ws");

    useEffect(() => {
        socket.onmessage = (event) => {
            setArtwork(JSON.parse(event.data));
        };
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
            {artwork ? (
                <>
                    <h1>{artwork.title}</h1>
                    <p>{artwork.description}</p>
                    <img src={artwork.image_url} alt={artwork.title} style={{ width: "300px" }} />
                    <audio controls src={artwork.audio_url}></audio>
                </>
            ) : (
                <p>Aproxime-se de uma obra para saber mais!</p>
            )}
        </div>
    );
}

export default Home;
