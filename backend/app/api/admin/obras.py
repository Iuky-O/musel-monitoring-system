from fastapi import APIRouter, HTTPException, UploadFile, File
from app.data.database import get_obra_collection
from app.models.ObraModel import ObraModel
from bson import ObjectId

router = APIRouter()

collection = get_obra_collection()

# from fastapi import APIRouter, HTTPException, UploadFile, File, Form
# from app.data.database import get_obra_collection
# from app.models.ObraModel import ObraModel
# from bson import ObjectId
# from pydantic import TypeAdapter
# from app.services.upload_drive import organize_and_upload_files
# import os

# router = APIRouter()

# @router.post("/obras")
# async def criar_obra(files: list[UploadFile] = File(...)):
#     folder_id = os.getenv("ID_PASTA_MONALISA")  # Pega o ID da pasta do ambiente
    
#     if not folder_id:
#         raise HTTPException(status_code=500, detail="ID da pasta 'monalisa' não configurado.")
    
#     try:
#         file_links = await organize_and_upload_files(folder_id, files)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erro ao fazer upload no Google Drive: {e}")
    
#     return {
#         "file_links": file_links,
#         "message": "Arquivos enviados com sucesso!"
#     }
## ANTIGOS


@router.get("/obras", response_model=list[ObraModel])
async def listar_obras():

    collection = await get_obra_collection()

    obras = []

    async for obra in collection.find():
        obra["_id"] = str(obra["_id"])
        obras.append(obra)

    return obras

@router.post("/obras")
async def criar_obra(obra: ObraModel):

    collection = await get_obra_collection()
    print(f"Recebendo dados: {obra}")

    obra_dict = obra.dict(by_alias=True)
    obra_dict.pop("_id", None)
    print(f"Dados convertidos para dicionário: {obra_dict}")

    result = await collection.insert_one(obra_dict)

    obra_dict['_id'] = str(result.inserted_id)
    
    return {**obra.dict(), "id": obra_dict['_id'], "message": "Obra criada com sucesso"}

@router.put("/obras/{id}")
async def atualiza_obra(id: str, obra: ObraModel):

    collection = await get_obra_collection()

    obra_dict = obra.dict(by_alias=True)
    obra_dict.pop("_id", None)

    for campo, valor in obra_dict.items():
        if valor is None or (isinstance(valor, list) and not valor):
            return {"message": f"O campo '{campo}' é obrigatório e não pode ser vazio."}

    result = await collection.replace_one({"_id": ObjectId(id)}, obra_dict)

    if result.matched_count == 0:
            return {"message": "Obra não encontrada para atualizar."}
        
    obra_dict["_id"] = id
    return {**obra.dict(), "id": id, "message": "Obra atualizada com sucesso!"}

@router.patch("/obras/{id}")
async def atualizar_parcial_obra(id: str, obra: ObraModel):
    collection = await get_obra_collection()
    
    obra_dict = obra.dict(exclude_unset=True, by_alias=True)# Converte a obra para dicionário, removendo o '_id' para evitar conflito
    
    # Verifica se há campos obrigatórios ausentes
    if not obra_dict.get("titulo"):
        return {"message": "O campo 'titulo' é obrigatório."}

    result = await collection.update_one({"_id": ObjectId(id)}, {"$set": obra_dict})# Atualiza a obra na coleção pelo ID

    if result.matched_count == 0:
        return {"message": "Obra não encontrada para atualizar."}
    
    # Retorna a obra atualizada
    obra_dict["_id"] = id
    return {**obra.dict(), "id": id, "message": "Obra atualizada com sucesso!"}

@router.delete("/obras/{id}")
async def deletar_obra(id: str):

    collection = await get_obra_collection()
    
    # Deleta a obra pela ID
    result = await collection.delete_one({"_id": ObjectId(id)})
    
    if result.deleted_count == 0:
        return {"message": "Obra não encontrada para excluir."}
    
    return {"message": f"Obra com ID {id} excluída com sucesso!"}
