# from fastapi import APIRouter, HTTPException
# from app.data.database import testar_conexao

# router = APIRouter()

# @router.get("/test-db")
# async def test_db():
#     try:
#         await testar_conexao()
#         return {"message": "Conexão com MongoDB bem-sucedida!"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
