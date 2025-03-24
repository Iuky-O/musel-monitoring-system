from fastapi import APIRouter, HTTPException
from app.models.interacao import Comentario, Curtida 
from app.services.interacao_service import InteracaoService  

router = APIRouter()

# Endpoint para adicionar um comentário
@router.post("/obras/{obra_id}/comentarios")
def adicionar_comentario(obra_id: str, comentario: Comentario):
    try:
        InteracaoService.adicionar_comentario(obra_id, comentario)
        return {"message": "Comentário adicionado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao adicionar comentário: {str(e)}")

# Endpoint para curtir uma obra
@router.post("/obras/{obra_id}/curtir")
def curtir_obra(obra_id: str, curtida: Curtida):
    try:
        InteracaoService.curtir_obra(obra_id, curtida)
        return {"message": "Obra curtida com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao curtir obra: {str(e)}")