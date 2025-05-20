from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, sensor, visitas, estatisticas, autenticacao
from app.models.Sensor import DistanceData
from app.api.exibicao import detectar_mao
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
app.include_router(visitas.router, prefix="/admin", tags=["Visitas"])
app.include_router(estatisticas.router, prefix="/admin", tags=["Estatisticas"])
app.include_router(sensor.router, prefix="/exibicao", tags=["Distancia"])
app.include_router(detectar_mao.router, prefix="/exibicao", tags=["Detecção"])
app.include_router(autenticacao.router, tags=["Admins"])

@app.get("/")
async def read_root():
    return {"message": "Servidor FastAPI funcionando!"}

