from fastapi import FastAPI
from .api.test_connection import router as test_router
from .api.vision import router as vision_router

app = FastAPI()

app.include_router(test_router, prefix="/api")
app.include_router(vision_router, prefix="/vision", tags=["vision"])

@app.get("/")
def home():
    return {"message": "API rodando!"}
