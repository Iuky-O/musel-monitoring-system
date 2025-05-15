from fastapi import APIRouter
from threading import Timer

router = APIRouter()

# Flag que indica se a mão foi fechada
detected = {"closed_hand": False}

@router.post("/detectar-mao-fechada")
def detectar_mao():
    detected["closed_hand"] = True

    # Reset automático após 5 segundos
    Timer(5.0, lambda: detected.update({"closed_hand": False})).start()
    return {"status": "ok"}

@router.get("/status-mao")
def status_mao():
    return {"closed_hand": detected["closed_hand"]}

