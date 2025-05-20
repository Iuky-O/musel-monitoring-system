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


from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")



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

    def gerar_pdf_com_graficos(dados):
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Título
        c.setFont("Helvetica-Bold", 14)
        c.drawString(200, height - 40, "Relatório de Visitas")
        
        # Gerar gráfico de barras
        nomes = [d.get("nome_obra", "Sem Nome") for d in dados]
        visitas = [d.get("numero_visitas", 0) for d in dados]

        fig, ax = plt.subplots(figsize=(8, 4))
        ax.bar(nomes, visitas, color='skyblue')
        ax.set_title("Visitas por Obra")
        ax.set_ylabel("Número de Visitas")
        ax.set_xticklabels(nomes, rotation=45, ha='right', fontsize=6)
        plt.tight_layout()

        # Salvar gráfico em memória
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='PNG')
        plt.close(fig)
        img_buffer.seek(0)

        # Inserir gráfico no PDF
        c.drawImage(ImageReader(img_buffer), 50, height - 300, width=500, height=200)

        # Espaço para tabela
        y = height - 330
        c.setFont("Helvetica-Bold", 12)
        c.drawString(20, y, "ID da Obra")
        c.drawString(200, y, "Nome da Obra")
        c.drawString(400, y, "Visitas")
        y -= 20
        c.setFont("Helvetica", 10)

        for d in dados:
            c.drawString(20, y, str(d.get("id_obra", "")))
            c.drawString(200, y, d.get("nome_obra", "")[:30])  # Limita o nome
            c.drawString(400, y, str(d.get("numero_visitas", 0)))
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 50

        c.save()
        buffer.seek(0)
        return buffer

    buffer = await run_in_threadpool(gerar_pdf_com_graficos, dados)

    headers = {
        "Content-Disposition": "attachment; filename=visitas_com_graficos.pdf"
    }

    return StreamingResponse(buffer, media_type="application/pdf", headers=headers)



async def gerar_pdf_com_tabela_e_graficos(dados_tabela, horarios_pico, visitas_por_dia, obras_mais_visitadas):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # 1) Título
    c.setFont("Helvetica-Bold", 14)
    c.drawString(200, height - 40, "Relatório de Visitas")

    # 2) Tabela (simples)
    y = height - 80
    c.setFont("Helvetica-Bold", 12)
    c.drawString(20, y, "ID da Obra")
    c.drawString(150, y, "Nome da Obra")
    c.drawString(400, y, "Visitas")
    y -= 20
    c.setFont("Helvetica", 10)
    for d in dados_tabela:
        c.drawString(20, y, str(d.get("id_obra", "")))
        c.drawString(150, y, d.get("nome_obra", "")[:30])
        c.drawString(400, y, str(d.get("numero_visitas", 0)))
        y -= 15
        if y < 200:  # Reserva espaço para gráficos embaixo
            c.showPage()
            y = height - 50

    # 3) Gráficos (gerar cada gráfico com matplotlib e inserir no PDF)
    # Função auxiliar para salvar gráfico em buffer e retornar buffer
    def criar_grafico_barra(x, y, titulo, xlabel, ylabel, cor):
        fig, ax = plt.subplots(figsize=(6, 2.5))
        ax.bar(x, y, color=cor)
        ax.set_title(titulo)
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        plt.xticks(rotation=45, ha='right', fontsize=7)
        plt.tight_layout()
        img_buf = io.BytesIO()
        plt.savefig(img_buf, format='PNG')
        plt.close(fig)
        img_buf.seek(0)
        return img_buf

    # Horários de pico
    x_horarios = [h['hora'] for h in horarios_pico]
    y_horarios = [h['visitas'] for h in horarios_pico]
    img1 = criar_grafico_barra(x_horarios, y_horarios, "Horários de Pico", "Hora", "Visitas", "#8884d8")

    # Visitas por dia
    x_dias = [v['data'] for v in visitas_por_dia]
    y_dias = [v['visitas'] for v in visitas_por_dia]
    img2 = criar_grafico_barra(x_dias, y_dias, "Visitas por Dia", "Data", "Visitas", "#82ca9d")

    # Obras mais visitadas
    x_obras = [o['nome'] for o in obras_mais_visitadas]
    y_obras = [o['visitas'] for o in obras_mais_visitadas]
    img3 = criar_grafico_barra(x_obras, y_obras, "Obras Mais Visitadas", "Obra", "Visitas", "#8814a0")

    # Inserir os gráficos no PDF um abaixo do outro, após a tabela
    pos_y = y - 220  # começa abaixo da tabela

    for img_buf in [img1, img2, img3]:
        c.drawImage(ImageReader(img_buf), 40, pos_y, width=500, height=150)
        pos_y -= 180  # espaço entre gráficos

    c.save()
    buffer.seek(0)
    return buffer

