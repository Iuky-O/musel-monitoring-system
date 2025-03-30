from fastapi import FastAPI
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, visitas
from app.api.ws import router as ws_router


app = FastAPI()

app.include_router(interacoes_router,prefix="/interacao", tags=["Interacao"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])
app.include_router(visitas.router, prefix="/admin", tags=["visitas"])
app.include_router(ws_router, prefix="/ws", tags=["websocket"])

@app.get("/")
def home():
    return {"message": "API rodando!"}
# from app.data.database import get_obra_collection
