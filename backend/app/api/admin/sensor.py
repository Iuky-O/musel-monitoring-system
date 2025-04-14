from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.models.Sensor import DistanceData
from app.models.DistanceModel import DistanceDT
from typing import Optional
from datetime import datetime, timedelta

router = APIRouter()

ultima_distancia = {"distancia": None}

@router.post("/distance")
async def receive_distance(data: DistanceData):
    print(f"Distância recebida: {data.distance} cm")
    ultima_distancia["distancia"] = data.distance  # Atualiza a variável global
    return {"status": "sucesso", "distance": data.distance}

@router.get("/distance")
async def get_last_distance():
    if ultima_distancia["distancia"] is None:
        return {"distancia": "Nenhuma distância registrada ainda"}
    return {"distancia": ultima_distancia["distancia"]}

# @router.post("/distance")
# async def receive_distance(data: DistanceData):
    # print("Payload recebido:", data)
    # id_obra = data.id_obra if hasattr(data, "id_obra") else 1
    # distancia = data.distance
    # agora = datetime.utcnow()

    # print(f"[{agora}] Obra {id_obra} - Distância: {distancia:.2f} cm")

    # if 100 <= distancia <= 150:  # entre 1m e 1.5m
    #     if id_obra not in presencas_ativas:
    #         presencas_ativas[id_obra] = {
    #             "inicio": agora,
    #             "ultimas_distancias": [distancia],
    #         }
    #         print(f">> Presença iniciada para obra {id_obra}")
    #     else:
    #         presencas_ativas[id_obra]["ultimas_distancias"].append(distancia)

    #     tempo_presente = agora - presencas_ativas[id_obra]["inicio"]
    #     if tempo_presente >= timedelta(minutes=1):
    #         print(f">> Visita contabilizada para obra {id_obra} ({tempo_presente.seconds} segundos)")

    #         visita = {
    #             "id_obra": id_obra,
    #             "timestamp_inicio": presencas_ativas[id_obra]["inicio"],
    #             "timestamp_fim": agora,
    #             "duracao": tempo_presente.seconds,
    #             "distancias": presencas_ativas[id_obra]["ultimas_distancias"],
    #             "contabilizada": True
    #         }

    #         # Salvar no MongoDB
    #         visitas = database["visitacoes"]
    #         await visitas.insert_one(visita)

    #         # Remover do controle ativo
    #         del presencas_ativas[id_obra]

    # else:
    #     # Distância fora do raio — reseta o controle de presença
    #     if id_obra in presencas_ativas:
    #         print(f">> Pessoa saiu do raio da obra {id_obra} antes de completar 1 minuto.")
    #         del presencas_ativas[id_obra]

    # return {"status": "recebido", "distance": distancia}