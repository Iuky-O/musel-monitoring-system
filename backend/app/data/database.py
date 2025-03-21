import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI= os.getenv("Mongo_URI")

client = AsyncIOMotorClient(MONGO_URI)
database = client.meu_banco
collection = database.usuarios

# Testar conexão
async def testar_conexao():
    try:
        await client.admin.command("ping")
        print("Conexão com MongoDB bem-sucedida!")
    except Exception as e:
        print(f" Erro ao conectar ao MongoDB: {e}")
