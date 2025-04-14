from pydantic import BaseModel,  Field

class DistanceDT(BaseModel):
    distance: float = Field(..., gt=0)
    id_obra: str
