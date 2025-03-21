from fastapi import FastAPI
from app.api.vision import router as vision_router

app = FastAPI()

app.include_router(vision_router, prefix="/vision", tags=["vision"])