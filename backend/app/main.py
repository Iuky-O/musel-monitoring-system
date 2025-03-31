from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, visitas, sensor
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
app.include_router(sensor.router, tags=["distance"])
app.include_router(ws_router, tags=["websocket"])


@app.get("/")
async def read_root():
    return {"message": "Hello World"}

