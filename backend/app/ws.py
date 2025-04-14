from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import asyncio

app = FastAPI()

# Lista de WebSockets conectados
clients = []

@app.get("/")
async def get():
    return HTMLResponse(open("frontend/public/index.html").read())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Conectar o cliente
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            # Aguarde mensagens do cliente (caso precise de alguma interação)
            data = await websocket.receive_text()
            print(f"Recebido do cliente: {data}")
    except:
        # Remover cliente desconectado
        clients.remove(websocket)

# Função para enviar os dados para todos os clientes conectados
async def send_data_to_clients(distance):
    for client in clients:
        try:
            data = {
                "type": "sensor_data",
                "presence": distance < 120,  # exemplo: presença se a distância for menor que 120cm
                "id_obra": 1,                # ID da obra (você pode trocar por algo dinâmico depois)
                "distance": distance
            }
            await client.send_json(data)
        except:
            clients.remove(client)


# Supondo que o código do sensor envia os dados, podemos chamar isso no backend
# Vamos simular o envio de distâncias para os clientes conectados a cada 1 segundo
async def simulate_sensor_data():
    while True:
        distance = 100
        await send_data_to_clients(distance)
        await asyncio.sleep(1)


# Rodar a simulação do sensor em paralelo com o servidor
@app.on_event("startup")
async def startup():
    asyncio.create_task(simulate_sensor_data())
