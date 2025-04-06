# from fastapi import APIRouter, Request, WebSocket
# from pydantic import BaseModel
# from typing import List

# # Guardar os clientes conectados
# websockets: List[WebSocket] = []
# router = APIRouter()

# # Variável global para armazenar a última distância recebida
# ultima_distancia = None

# class SensorData(BaseModel):
#     distance: int

# @router.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     websockets.append(websocket)
#     try:
#         while True:
#             await websocket.receive_text()  # só pra manter a conexão
#     except WebSocketDisconnect:
#         websockets.remove(websocket)


# # @router.post("/distance")
# # async def receber_distancia(request: Request):
# #     data = await request.json()
# #     print(">>> RECEBIDO:", data)
# #     return {"message": "Dados recebidos com sucesso"}


# # async def receive_distance(data: SensorData):
# #     global ultima_distancia
# #     ultima_distancia = data.distance
# #     print(f"Distância recebida: {data.distance} cm")
# #     return {"message": "Distância recebida com sucesso", "distancia": data.distance}

# @router.get("/ultima-distancia")
# async def get_ultima_distancia():
#     if ultima_distancia is not None:
#         return {"distancia": ultima_distancia}
#     else:
#         return {"distancia": None, "message": "Nenhuma distância registrada ainda"}


# @router.post("/distance")
# async def receber_distancia(request: Request):
#     data = await request.json()
#     print(">>> RECEBIDO:", data)

#     # Enviar para todos os clientes WebSocket conectados
#     for ws in websockets:
#         await ws.send_json({
#             "presence": True,
#             "id_obra": 1  # Substitua com o ID correto vindo do sensor
#         })

#     return {"message": "Dados recebidos com sucesso"}


from fastapi import APIRouter
from pydantic import BaseModel
from app.api.exibicao.ws import send_data_to_clients


router = APIRouter()

class DistanceData(BaseModel):
    distance: int

@router.post("/distance")
async def receive_distance(data: DistanceData):
    try:
        await send_data_to_clients(data.distance)
        print(f"Distância recebida: {data.distance} cm")
        return {"status": "sucesso", "distance": data.distance}
    except Exception as e:
        print(f"Erro ao enviar para WebSocket: {e}")
        return {"status": "erro", "detalhes": str(e)}

