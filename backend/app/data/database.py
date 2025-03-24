import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB")

client = AsyncIOMotorClient(MONGO_URL)
database = client[MONGO_DB]
# collection = database.usuarios
colecao_interacoes = database["interacoes"]

@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command("ping")
        print("Conexão com MongoDB bem-sucedida!")
    except Exception as e:
        print(f"Erro ao conectar ao MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

async def get_obra_collection():
    return database.get_collection("obras_de_arte")

@app.get("/")
async def read_root():
    collection = await get_obra_collection()
    obras = await collection.find().to_list(10)
    return obras

# Testar conexão
async def testar_conexao():
    try:
        await client.admin.command("ping")
        print("Conexão com MongoDB bem-sucedida!")
    except Exception as e:
        print(f" Erro ao conectar ao MongoDB: {e}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)