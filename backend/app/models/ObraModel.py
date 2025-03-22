from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class ObraModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    titulo: str
    artistas: List[str]
    descricao: str
    localizacao: Optional[str] = None
    ano: Optional[int] = None
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    imagens: Optional[List[str]] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
        