from pydantic import BaseModel

class Comentario(BaseModel):
    usuario: str
    conteudo: str

class Curtida(BaseModel):
    usuario: str