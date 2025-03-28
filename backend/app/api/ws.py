from fastapi import APIRouter, WebSocket
import json
from typing import Set

router = APIRouter()
active_connections: Set[WebSocket] = set()

async def broadcast_visita_update(id_obra: str, count: int):
    message = json.dumps({
        "type": "visita_update",
        "id_obra": id_obra,
        "count": count
    })
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except:
            active_connections.remove(connection)

async def broadcast_sensor_data(distance: float, presence: bool, id_obra: str):
    message = json.dumps({
        "type": "sensor_data",
        "distance": distance,
        "presence": presence,
        "id_obra": id_obra
    })
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except:
            active_connections.remove(connection)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            # Manter a conexão aberta
            await websocket.receive_text()
    except Exception as e:
        print(f"Erro no WebSocket: {e}")
    finally:
        active_connections.remove(websocket)
        await websocket.close()