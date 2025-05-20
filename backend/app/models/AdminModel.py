from pydantic import BaseModel,  Field
from typing import List, Optional, Dict

class AdminModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    key: str
    user: str

class AdminPost(BaseModel):
    key: str