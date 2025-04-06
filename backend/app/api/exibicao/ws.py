from fastapi import APIRouter, WebSocket
import asyncio

router = APIRouter()
clients = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Mensagem recebida: {data}")
    except:
        clients.remove(websocket)

async def send_data_to_clients(distance):
    for client in clients:
        try:
            await client.send_text(f"{distance}")
        except:
            clients.remove(client)
