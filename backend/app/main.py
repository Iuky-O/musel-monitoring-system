from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.exibicao.interacoes import router as interacoes_router
from app.api.admin import obras, sensor, visitas
from app.models.Sensor import DistanceData
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
app.include_router(sensor.router, prefix="/exibicao", tags=["distance"])

@app.get("/")
async def read_root():
    return {"message": "Servidor FastAPI funcionando!"}

