from fastapi import FastAPI
from .api.test_connection import router as test_router
from .api.embarcado.vision import router as vision_router
from .api.exibicao.interacoes import router as interacoes_router
from .api.exibicao.conteudo import router as conteudo_router
from app.api.admin import obras 

app = FastAPI()

app.include_router(test_router, prefix="/api")
app.include_router(interacoes_router,prefix="/interation", tags=["Interation"])
app.include_router(conteudo_router,prefix="/content", tags=["content"])
app.include_router(vision_router, prefix="/vision", tags=["vision"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])

@app.get("/")
def home():
    return {"message": "API rodando!"}
from app.data.database import get_obra_collection
