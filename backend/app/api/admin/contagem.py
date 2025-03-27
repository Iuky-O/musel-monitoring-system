from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.models.VisitModel import VisitModel
from app.data.database import get_visitacoes_collection, get_obra_collection

router = APIRouter()


from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.data.database import get_visit_collection

router = APIRouter()

@router.post("/visitas/{id_obra}/incrementa")
async def incrementa_visita(id_obra: str):
    collection = await get_visitacoes_collection()

    # Busca a visita relacionada à obra
    visita = await collection.find_one({"id_obra": id_obra})

    if not visita:
        raise HTTPException(status_code=404, detail="Visita não encontrada para essa obra.")

    # Incrementa o número de visitas
    await collection.update_one(
        {"_id": ObjectId(visita["_id"])},
        {"$inc": {"numero_visitas": 1}}
    )

    return {"message": "Visita registrada com sucesso!"}


# @router.post("/contagem")
# async def criar_contagem(contagem: VisitModel):
#     # Valida se a obra existe
#     obra_collection = await get_obra_collection()
#     obra = await obra_collection.find_one({"_id": ObjectId(contagem.id_obra)})

#     if not obra:
#         raise HTTPException(status_code=404, detail="Obra não encontrada para vincular a contagem.")

#     collection = await get_visitacoes_collection()
#     contagem_dict = contagem.dict(by_alias=True)
#     contagem_dict.pop("_id", None)

#     result = await collection.insert_one(contagem_dict)
#     contagem_dict["_id"] = str(result.inserted_id)

#     return {"message": "Contagem criada com sucesso.", "data": contagem_dict}

# @router.get("/contagem")
# async def listar_contagens():
#     collection = await get_visitacoes_collection()
#     contagens = []
#     async for contagem in collection.find():
#         contagem["_id"] = str(contagem["_id"])
#         contagens.append(contagem)
#     return contagens

# # @router.patch("/contagem/{id}")
# async def incrementar_visita(id: str):
#     collection = await get_visitacoes_collection()
    
#     result = await collection.update_one(
#         {"_id": ObjectId(id)},
#         {"$inc": {"numero_visitas": 1}}
#     )

#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Contagem não encontrada.")

#     return {"message": "Visita contabilizada com sucesso!"}

# @router.delete("/contagem/{id}")
# async def deletar_contagem(id: str):
#     collection = await get_visitacoes_collection()
#     result = await collection.delete_one({"_id": ObjectId(id)})

#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Contagem não encontrada para deletar.")

#     return {"message": f"Contagem com ID {id} excluída com sucesso!"}