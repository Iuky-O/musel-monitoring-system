from fastapi import APIRouter, HTTPException, UploadFile, File
from app.data.database import get_admin_collection
from app.models.AdminModel import AdminModel, AdminPost
from bson import ObjectId

router = APIRouter()

collection = get_admin_collection()

@router.get("/autenticacao", response_model=list[AdminModel])
async def listar_admins():

    collection = get_admin_collection()

    admins = []

    async for admin in collection.find():
        admin["_id"] = str(admin["_id"])
        admins.append(admin)

    return admins

@router.post("/autenticar", response_model=AdminModel)
async def autenticar_admin(data: AdminPost):
    admin = await collection.find_one({"key": data.key})

    if not admin:
        raise HTTPException(status_code=401, detail="Chave inválida")

    admin["_id"] = str(admin["_id"])
    return admin