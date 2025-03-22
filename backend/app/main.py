from fastapi import FastAPI
from .api.test_connection import router as test_router
from .api.embarcado.vision import router as vision_router
from app.api.admin import obras  # Certo, como está!

app = FastAPI()

# app.include_router(test_router, prefix="/api")
app.include_router(vision_router, prefix="/vision", tags=["vision"])
app.include_router(obras.router, prefix="/admin", tags=["obras"])

@app.get("/")
def home():
    return {"message": "API rodando!"}