from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.models.Sensor import DistanceData
from typing import Optional

router = APIRouter()

@router.post("/distance")
async def receive_distance(data: DistanceData):
    print(f"Distância recebida: {data.distance} cm")
    return {"status": "sucesso", "distance": data.distance}