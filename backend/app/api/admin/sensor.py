from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.models.Sensor import DistanceData
from app.models.DistanceModel import DistanceDT
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

ultima_distancia = {"distancia": None}
tempo_inicial_visita = None
tempo_necessario = timedelta(seconds=30)

# ID da obra associada
ID_OBRA = "67e0adad46e5b921c4a270d9"
NOME_OBRA = "TESTE"

@router.post("/distance")
async def receive_distance(data: DistanceData):
    global tempo_inicial_visita

    print(f"Distância recebida: {data.distance} cm")
    ultima_distancia["distancia"] = data.distance

    # Verifica se esta entre (1 metro a 1,5 metro (100 a 150 cm))
    if 20 <= data.distance <= 30:
        # Se ainda não começou a contar tempo
        if tempo_inicial_visita is None:
            tempo_inicial_visita = datetime.now()
            print("Começou a contar tempo para visita.")
        else:
            tempo_passado = datetime.now() - tempo_inicial_visita
            if tempo_passado >= tempo_necessario:
                print("Tempo alcançado! Registrando visita...") #Se completar 30 segundos: registra uma visita.
                await registrar_visita(ID_OBRA, NOME_OBRA)
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
