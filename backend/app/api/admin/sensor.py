from fastapi import APIRouter, HTTPException
from app.data.database import database
from app.models.Sensor import DistanceData
from typing import Optional
from app.api.ws import broadcast_visita_update, broadcast_sensor_data

router = APIRouter()

@router.post("/distance")
async def receive_distance(data: DistanceData):
    print(f"Distância recebida: {data.distance} cm")
    return {"status": "sucesso", "distance": data.distance}