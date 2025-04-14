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

colecao_interacoes = database["interacoes"]
colecao_visitas = database["visitacoes"]

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

def get_obra_collection():
    return database['obras_de_arte']

def get_visita_collection():
    return database.get_collection("visitacoes")


@app.get("/")
async def read_root():
    collection = get_obra_collection()
    obras = await collection.find().to_list(10)
    return obras

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)