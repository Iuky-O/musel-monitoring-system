from app.data.database import colecao_interacoes
from app.models.interacao import Comentario, Curtida

class InteracaoService:
    @staticmethod
    def adicionar_comentario(obra_id: str, comentario: Comentario):
        colecao_interacoes.insert_one({
            "obra_id": obra_id,
            "tipo": "comentario",
            "conteudo": comentario.conteudo,
            "usuario": comentario.usuario
        })

    @staticmethod
    def curtir_obra(obra_id: str, curtida: Curtida):
        colecao_interacoes.insert_one({
            "obra_id": obra_id,
            "tipo": "curtida",
            "usuario": curtida.usuario
        })