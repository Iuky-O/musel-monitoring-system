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



# from fastapi import APIRouter, WebSocket, WebSocketDisconnect
# import json
# import asyncio
# from typing import Set

# router = APIRouter()
# active_connections: Set[WebSocket] = set()

# async def send_test_messages():
#     """Função para testar envio automático de mensagens"""
#     while True:
#         await asyncio.sleep(5)  # Envia uma mensagem a cada 5 segundos
#         message = json.dumps({
#             "type": "test",
#             "message": "Teste de conexão WebSocket!"
#         })
#         for connection in list(active_connections):
#             try:
#                 await connection.send_text(message)
#             except:
#                 active_connections.remove(connection)

# async def broadcast_visita_update(id_obra: str, count: int):
#     message = json.dumps({
#         "type": "visita_update",
#         "id_obra": id_obra,
#         "count": count
#     })
#     to_remove = set()

#     for connection in active_connections:
#         try:
#             await connection.send_text(message)
#         except:
#             to_remove.add(connection)

#     for connection in to_remove:
#         active_connections.remove(connection)

# async def broadcast_sensor_data(distance: float, presence: bool, id_obra: str):
#     alert = None

#     if distance < 100:
#         alert = "ALERTA: Tela vermelha!"
#     elif 100 < distance < 160:
#         alert = "OBRAAAA!"

#     message = json.dumps({
#         "type": "sensor_data",
#         "distance": distance,
#         "presence": presence,
#         "id_obra": id_obra,
#         "alert": alert
#     })

#     to_remove = set()
#     for connection in active_connections:
#         try:
#             await connection.send_text(message)
#         except:
#             to_remove.add(connection)

#     for connection in to_remove:
#         active_connections.remove(connection)

# @router.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     active_connections.add(websocket)
#     print("Cliente conectado!")

#     # Envia mensagens de teste
#     asyncio.create_task(send_test_messages())

#     try:
#         while True:
#             msg = await websocket.receive_text()
#             print(f"Mensagem recebida: {msg}")  # Para debugging
#             # Supondo que o frontend envie algum tipo de dado
#             if msg == "trigger_visita_update":
#                 await broadcast_visita_update("obra123", 10)  # Testando o envio de visitas
#             elif msg == "trigger_sensor_data":
#                 await broadcast_sensor_data(120.5, True, "obra123")  # Testando dados de sensor
#     except WebSocketDisconnect:
#         print("Cliente desconectado!")
#     except Exception as e:
#         print(f"Erro inesperado no WebSocket: {e}")
#     finally:
#         if websocket in active_connections:
#             active_connections.remove(websocket)
#         try:
#             await websocket.close()
#         except:
#             pass  # Ignora erros caso o WebSocket já tenha sido fechado
