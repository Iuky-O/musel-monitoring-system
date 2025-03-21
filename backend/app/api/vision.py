from fastapi import APIRouter, HTTPException
from app.services.computer_vision import ComputerVisionService

router = APIRouter()
vision_service = ComputerVisionService()

@router.post("/predict")
async def predict(image: str):
    try:
        result = vision_service.predict(image)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
