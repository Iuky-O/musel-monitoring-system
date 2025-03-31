from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, visitas
from app.api.ws import router as ws_router


app = FastAPI()

# Permitir requisições do frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Origem do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interacoes_router,prefix="/interacao", tags=["Interacao"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])
app.include_router(visitas.router, prefix="/admin", tags=["visitas"])
app.include_router(ws_router, tags=["websocket"])


@app.get("/")
def home():
    return {"message": "API rodando!"}
# from app.data.database import get_obra_collection
