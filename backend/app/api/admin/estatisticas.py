# Adicionando novos endpoints ao seu arquivo para fornecer estatísticas detalhadas
from fastapi import APIRouter
from datetime import datetime, timedelta
from app.data.database import database
from fastapi.responses import JSONResponse, StreamingResponse
from bson.son import SON
import pandas as pd
from fastapi.concurrency import run_in_threadpool
from app.data.database import get_visita_collection, get_obra_collection
import io

router = APIRouter()
leituras_collection = database["leituras"]
visitacoes_collection = database["visitacoes"]

# Visitantes por dia/semana/mês
@router.get("/estatisticas/visitas-por-periodo")
async def visitas_por_periodo(periodo: str = "dia"):
    if periodo not in ["dia", "semana", "mes"]:
        return JSONResponse(status_code=400, content={"erro": "Período inválido. Use 'dia', 'semana' ou 'mes'."})

    formato_data = {
        "dia": "%Y-%m-%d",
        "semana": "%Y-W%U",
        "mes": "%Y-%m"
    }[periodo]

    pipeline = [
        {"$project": {"data": {"$dateToString": {"format": formato_data, "date": "$timestamp"}}}},
        {"$group": {"_id": "$data", "total": {"$sum": 1}}},
        {"$sort": SON([("_id", 1)])}
    ]

    resultado = await leituras_collection.aggregate(pipeline).to_list(length=100)
    return resultado

# Horários de pico
@router.get("/estatisticas/horarios-de-pico")
async def horarios_de_pico():
    pipeline = [
        {"$project": {"hora": {"$hour": "$timestamp"}}},
        {"$group": {"_id": "$hora", "total": {"$sum": 1}}},
        {"$sort": SON([("total", -1)])}
    ]
    resultado = await leituras_collection.aggregate(pipeline).to_list(length=24)
    return resultado

# Média, mínima e máxima distância
@router.get("/estatisticas/distancias")
async def estatisticas_distancias():
    pipeline = [
        {
            "$group": {
                "_id": None,
                "media": {"$avg": "$distancia"},
                "minima": {"$min": "$distancia"},
                "maxima": {"$max": "$distancia"}
            }
        }
    ]
    resultado = await leituras_collection.aggregate(pipeline).to_list(length=1)
    return resultado[0] if resultado else {}

# Histórico de presença
@router.get("/estatisticas/historico-presenca")
async def historico_presenca():
    pipeline = [
        {"$sort": {"timestamp": -1}},
        {"$limit": 100},
        {"$project": {"_id": 0, "distancia": 1, "timestamp": 1}}
    ]
    resultado = await leituras_collection.aggregate(pipeline).to_list(length=100)
    return resultado

@router.get("/estatisticas/exportar-csv")
async def exportar_visitas_csv():
    collection = get_visita_collection()
    dados = await collection.find({}).to_list(length=1000)
    visitas = []

    for d in dados:
        visitas.append({
            "ID da Obra": d.get("id_obra"),
            "Nome da Obra": d.get("nome_obra"),
            "Visitas": d.get("numero_visitas", 0)
        })

    df = pd.DataFrame(visitas)

    if df.empty:
        return {"detail": "Nenhum dado para exportar."}

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)

    headers = {
        "Content-Disposition": "attachment; filename=visitas.csv"
    }
    return StreamingResponse(stream, media_type="text/csv", headers=headers)

@router.get("/estatisticas/exportar-pdf")
async def exportar_visitas_pdf():
    collection = get_visita_collection()
    dados = await collection.find({}).to_list(length=1000)

    if not dados:
        return {"detail": "Nenhum dado para exportar."}

    def gerar_pdf(dados):
        import io
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        y = height - 50
        c.setFont("Helvetica-Bold", 12)
        c.drawString(20, y, "ID da Obra")
        c.drawString(200, y, "Nome da Obra")
        c.drawString(400, y, "Visitas")
        y -= 20
        c.setFont("Helvetica", 10)

        for d in dados:
            c.drawString(20, y, str(d.get("id_obra", "")))
            c.drawString(200, y, d.get("nome_obra", ""))
            c.drawString(400, y, str(d.get("numero_visitas", 0)))
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 50

        c.save()
        buffer.seek(0)
        return buffer

    buffer = await run_in_threadpool(gerar_pdf, dados)

    headers = {
        "Content-Disposition": "attachment; filename=visitas.pdf"
    }
 
    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)
