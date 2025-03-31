const ws = new WebSocket("ws://127.0.0.1:8000/ws");

ws.onopen = () => console.log("Conectado ao WebSocket!");
ws.onerror = (error) => console.error("Erro no WebSocket:", error);
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const messageElement = document.getElementById("message");

    messageElement.innerText = data.alert || "Nenhum alerta";

    if (data.alert && data.alert.includes("ALERTA")) {
        document.body.classList.add("alert");
    } else {
        document.body.classList.remove("alert");
    }
};
