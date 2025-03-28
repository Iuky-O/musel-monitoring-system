from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.models.VisitModel import VisitModel
from bson import ObjectId
from typing import Optional
from app.api.ws import broadcast_visita_update, broadcast_sensor_data

router = APIRouter()

@router.post("/visitas")
async def criar_ou_atualizar_visita(visit: VisitModel):
    try:
        # Verifica se já existe uma visita para esta obra
        existing_visit = await database.visitas.find_one({"id_obra": visit.id_obra})
        
        if existing_visit:
            # Atualiza a contagem incrementando
            new_count = existing_visit.get("numero_visitas", 0) + visit.numero_visitas
            await database.visitas.update_one(
                {"_id": existing_visit["_id"]},
                {"$set": {"numero_visitas": new_count}}
            )
            visit_id = str(existing_visit["_id"])
        else:
            # Cria uma nova visita
            visit_dict = visit.dict(by_alias=True)
            visit_dict.pop("_id", None)
            result = await database.visitas.insert_one(visit_dict)
            visit_id = str(result.inserted_id)
            new_count = visit.numero_visitas
        
        await broadcast_visita_update(visit.id_obra, new_count)
        
        return {
            "id": visit_id,
            "id_obra": visit.id_obra,
            "numero_visitas": new_count,
            "message": "Visita registrada com sucesso"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visitas/{id_obra}", response_model=VisitModel)
async def obter_visitas_obra(id_obra: str):
    visit = await database.visitas.find_one({"id_obra": id_obra})
    if not visit:
        return {
            "id_obra": id_obra,
            "numero_visitas": 0
        }
    visit["_id"] = str(visit["_id"])
    return visit

@router.get("/visitas")
async def listar_todas_visitas():
    visits = []
    async for visit in database.visitas.find():
        visit["_id"] = str(visit["_id"])
        visits.append(visit)
    return visits

@router.post("/sensor-data")
async def receber_dados_sensor(distance: float, presence: bool, id_obra: str):
    try:
        # Notifica via WebSocket
        await broadcast_sensor_data(distance, presence, id_obra)
        return {"status": "Dados recebidos"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))