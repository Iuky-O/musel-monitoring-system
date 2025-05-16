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
