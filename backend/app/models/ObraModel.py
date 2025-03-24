from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from bson import ObjectId

from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class ObraModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    titulo: Optional[str] = None
    artistas: Optional[List[str]] = None
    descricao: Optional[str] = None
    localizacao: Optional[str] = None
    ano: Optional[int] = None
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    imagens_url: Optional[List[str]] = []

    # id: Optional[str] = Field(None, alias="_id")
    # titulo: Optional[str] = None
    # artistas: Optional[List[str]] = None
    # descricao: Optional[str] = None
    # localizacao: Optional[str] = None
    # ano: Optional[int] = None
    # arquivos: Optional[Dict[str, List[str]]] = {}
    # # Exemplo de estrutura: {"imagem": ["link1", "link2"], "video": ["link_video"], "audio": ["link_audio"]}
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }