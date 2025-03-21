from fastapi import APIRouter, HTTPException
from app.data.database import get_obra_collection
from app.models.ObraModel import ObraModel
from bson import ObjectId

router = APIRouter()

collection = get_obra_collection()

# Endpoint GET - Listar Obras
@router.get("/obras", response_model=list[ObraModel])
async def listar_obras():
    obras = []

    async for obra in collection.find():
        obra["_id"] = str(obra["_id"])
        obras.append(obra)

    return obras

# Endpoint POST - Criar Obra
@router.post("/obras")
async def criar_obra(obra: ObraModel):

    obra_dict = obra.dict(by_alias=True)
    
    result = await collection.insert_one(obra_dict)

    return {"id": str(result.inserted_id), "message": "Obra criada com sucesso"}
