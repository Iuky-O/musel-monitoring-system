from fastapi import FastAPI
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, visitas
from app.api.ws import router as ws_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens (atenção com segurança)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)


app.include_router(interacoes_router,prefix="/interacao", tags=["Interacao"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])
app.include_router(visitas.router, prefix="/admin", tags=["visitas"])
app.include_router(ws_router, prefix="/ws", tags=["websocket"])

@app.get("/")
def home():
    return {"message": "API rodando!"}
# from app.data.database import get_obra_collection
