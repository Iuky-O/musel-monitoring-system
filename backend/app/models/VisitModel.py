from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class VisitModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    id_obra: str
    nome_obra: Optional[str] = None
    numero_visitas: Optional[int] = 0

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }