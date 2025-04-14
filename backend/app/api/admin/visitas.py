from fastapi import APIRouter, HTTPException
from app.data.database import get_visita_collection, get_obra_collection
from app.models.VisitModel import VisitModel
from bson import ObjectId

router = APIRouter()

@router.get("/visitas", response_model=list[VisitModel])
async def listar_visitas():
    collection = get_visita_collection()
    visitas = []

    async for visita in collection.find():
        visita["_id"] = str(visita["_id"])
        visitas.append(visita)

    return visitas

@router.get("/visitas/{id_obra}", response_model=VisitModel)
async def buscar_visita_por_obra(id_obra: str):
    collection = get_visita_collection()

    visita = await collection.find_one({"id_obra": id_obra})
    if not visita:
        raise HTTPException(status_code=404, detail="Visita não encontrada")
    
    visita["_id"] = str(visita["_id"])
    return visita

@router.post("/visitas/{id_obra}")
async def criar_visita(id_obra: str):
    visita_collection = get_visita_collection()
    obra_collection = get_obra_collection()

    obra = await obra_collection.find_one({"_id": ObjectId(id_obra)})
    if not obra:
        raise HTTPException(status_code=404, detail="Obra não encontrada")

    # Verifica se já existe uma visita
    visita_existente = await visita_collection.find_one({"id_obra": id_obra})
    if visita_existente:
        raise HTTPException(status_code=400, detail="Visita já registrada para essa obra.")
        

    nova_visita = {
        "id_obra": id_obra,
        "nome_obra": obra.get("titulo", "O Grito"),
        "numero_visitas": 1
    }

    result = await visita_collection.insert_one(nova_visita)
    nova_visita["_id"] = str(result.inserted_id)

    print(f"Visita")
    return {**nova_visita, "message": "Visita registrada com sucesso!"}

@router.patch("/visitas/{id_obra}")
async def incrementar_visita(id_obra: str):
    collection = get_visita_collection()

    visita = await collection.find_one({"id_obra": id_obra})
    if not visita:
        raise HTTPException(status_code=404, detail="Visita não encontrada")

    nova_contagem = visita.get("numero_visitas", 0) + 1
    await collection.update_one(
        {"id_obra": id_obra},
        {"$set": {"numero_visitas": nova_contagem}}
    )

    return {"id_obra": id_obra, "numero_visitas": nova_contagem, "message": "Visita contabilizada!"}





# from fastapi import APIRouter, HTTPException
# from app.data.database import database
# from app.models.VisitModel import VisitModel
# from app.models.Sensor import DistanceData
# from bson import ObjectId
# from typing import Optional
# # from app.api.ws import broadcast_visita_update, broadcast_sensor_data

# router = APIRouter()

# @router.post("/visitas")
# async def criar_ou_atualizar_visita(visit: VisitModel):
#     try:
#         # Verifica se já existe uma visita para esta obra
#         existing_visit = await database.visitas.find_one({"id_obra": visit.id_obra})
        
#         if existing_visit:
#             # Atualiza a contagem incrementando
#             new_count = existing_visit.get("numero_visitas", 0) + visit.numero_visitas
#             await database.visitas.update_one(
#                 {"_id": existing_visit["_id"]},
#                 {"$set": {"numero_visitas": new_count}}
#             )
#             visit_id = str(existing_visit["_id"])
#         else:
#             # Cria uma nova visita
#             visit_dict = visit.dict(by_alias=True)
#             visit_dict.pop("_id", None)
#             result = await database.visitas.insert_one(visit_dict)
#             visit_id = str(result.inserted_id)
#             new_count = visit.numero_visitas
        
#         await broadcast_visita_update(visit.id_obra, new_count)
        
#         return {
#             "id": visit_id,
#             "id_obra": visit.id_obra,
#             "numero_visitas": new_count,
#             "message": "Visita registrada com sucesso"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/visitas/{id_obra}", response_model=VisitModel)
# async def obter_visitas_obra(id_obra: str):
#     visit = await database.visitas.find_one({"id_obra": id_obra})
#     if not visit:
#         return {
#             "id_obra": id_obra,
#             "numero_visitas": 0
#         }
#     visit["_id"] = str(visit["_id"])
#     return visit

# @router.get("/visitas")
# async def listar_todas_visitas():
#     visits = []
#     async for visit in database.visitas.find():
#         visit["_id"] = str(visit["_id"])
#         visits.append(visit)
#     return visits

# # @router.post("/sensor-data")
# # async def receber_dados_sensor(distance: float, presence: bool, id_obra: str):
# #     try:
# #         # Notifica via WebSocket
# #         await broadcast_sensor_data(distance, presence, id_obra)
# #         return {"status": "Dados recebidos"}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/distance")
# async def receive_distance(data: DistanceData):
#     print(f"Distância recebida: {data.distance} cm")
#     return {"status": "sucesso", "distance": data.distance}