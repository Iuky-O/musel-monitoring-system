from fastapi import FastAPI
from .api.embarcado.vision import router as vision_router
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras 

app = FastAPI()

app.include_router(interacoes_router,prefix="/interacao", tags=["Interacao"])
app.include_router(vision_router, prefix="/vision", tags=["vision"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])

@app.get("/")
def home():
    return {"message": "API rodando!"}
from app.data.database import get_obra_collection
