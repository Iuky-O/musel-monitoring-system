import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB")

client = AsyncIOMotorClient(MONGO_URL)
database = client[MONGO_DB]
# collection = database.usuarios

# Testar conexão
async def testar_conexao():
    try:
        await client.admin.command("ping")
        print("Conexão com MongoDB bem-sucedida!")
    except Exception as e:
        print(f" Erro ao conectar ao MongoDB: {e}")


def get_obra_collection():
    return database.get_collection("obras_de_arte")
