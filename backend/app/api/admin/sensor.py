from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.data.database import get_visita_collection, get_obra_collection
from app.models.Sensor import DistanceData
from app.models.DistanceModel import DistanceDT
from datetime import datetime, timedelta
from typing import Optional
import httpx
from dotenv import load_dotenv
import os
from zoneinfo import ZoneInfo
from datetime import timedelta, timezone

router = APIRouter()

ultima_distancia = {"distancia": None}
tempo_inicial_visita = None
tempo_necessario = timedelta(seconds=10)
status_pessoa_presente = False

data_e_hora = datetime.now(ZoneInfo("America/Sao_Paulo")) - timedelta(hours=3)


# ID da obra associada
ID_OBRA = os.getenv("ID_ATUAL")
async def buscar_nome_obra_por_id(id_obra: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://127.0.0.1:8000/admin/obras/{id_obra}")
            if response.status_code == 200:
                obra_data = response.json()
                return obra_data.get("titulo", "Desconhecido")
            else:
                print(f"Erro ao buscar obra. Status: {response.status_code}")
                return "Desconhecido"
    except Exception as e:
        print(f"Erro ao buscar nome da obra: {e}")
        return "Desconhecido"

leituras_collection = database["leituras"]

@router.post("/distance")
async def receive_distance(data: DistanceData):
    global tempo_inicial_visita

    print(f"Distância recebida: {data.distance} cm")
    ultima_distancia["distancia"] = data.distance

    # Verifica se esta entre (1 metro a 1,5 metro (100 a 150 cm))
    if 20 <= data.distance <= 50:
        # Se ainda não começou a contar tempo
        if tempo_inicial_visita is None:
            tempo_inicial_visita = datetime.now()
            print("Começou a contar tempo para visita.")
        else:
            tempo_passado = datetime.now() - tempo_inicial_visita
            if tempo_passado >= tempo_necessario:
                print("Tempo alcançado! Registrando visita...") #Se completar 30 segundos: registra uma visita.
                nome_obra = await buscar_nome_obra_por_id(ID_OBRA)
                await registrar_visita(ID_OBRA, nome_obra)

                await leituras_collection.insert_one({
                    "id_obra": ID_OBRA,
                    "distancia": data.distance,
                    "timestamp": data_e_hora
                })
                print(data_e_hora)

                tempo_inicial_visita = None  # Reseta para contar uma nova visita depois
    else:
        # Se sair da distância correta, resetar o tempo
        if tempo_inicial_visita is not None:
            print("Pessoa saiu da distância, resetando tempo.")
        tempo_inicial_visita = None

    return {"status": "sucesso", "distance": data.distance}

@router.get("/distance")
async def get_last_distance():
    if ultima_distancia["distancia"] is None:
        return {"distancia": "Nenhuma distância registrada ainda"}
    return {"distancia": ultima_distancia["distancia"]}

async def registrar_visita(id_obra: str, nome_obra: str):
    visitacoes_collection = database["visitacoes"]

    # Procurar se já existe uma visitação para essa obra
    visita_existente = await visitacoes_collection.find_one({"id_obra": id_obra})

    if visita_existente:
        # Incrementa o número de visitas
        await visitacoes_collection.update_one(
            {"id_obra": id_obra},
            {"$inc": {"numero_visitas": 1}}
        )
        print(f"Visita registrada! Total agora: {visita_existente['numero_visitas'] + 1}")
    else:
        # Cria um novo registro
        await visitacoes_collection.insert_one({
            "id_obra": id_obra,
            "nome_obra": nome_obra,
            "numero_visitas": 1
        })
        print("Primeira visita registrada para a obra.")
