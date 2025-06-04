<h1 align="center">
  <b>🎨 Nosso Museu 🎨</b>
</h1>
<h2 align="center">
  <b>Sistema de Monitoramento e Interação com Obras de Arte</b>
</h2>

## 📌 Descrição do Projeto
Este sistema integra hardware (ESP32 e sensores), backend (FastAPI), frontend (JavaScript) e visão computacional para criar uma **experiência interativa em exposições e museus**. 

Ao detectar um visitante, o sistema exibe informações multimídia sobre a obra em tempo real.

## ⚙️ Tecnologias Utilizadas
- **Backend:** Python 3.9+, FastAPI, Uvicorn, OpenCV, WebSockets, MongoDB, Firebase Storage
- **Frontend:** HTML, CSS, JavaScript (Webpack/Babel)
- **Banco de Dados:** MongoDB + Firebase Storage
- **Embarcado:** ESP32, ESP32-CAM, sensores HC-SR04

## 🚀 Como Executar o Projeto Localmente
## 📥 Clonar o Repositório

```bash
git clone https://github.com/Iuky-O/musel-monitoring-system.git
```

<h1 align="center">
  <b>🌜 Back-end 🌜</b>
</h1>

## 🐍 1. Criando o ambiente virtual

### 1. Criando

```bash
python -m venv venv
```
ou

```bash
python3 -m venv venv
```

### 2. Ativando
 
**🔹 Windows (CMD ou PowerShell):**
```bash
venv\Scripts\activate
```

**🔸 Linux / MacOS:**
```bash
source venv/bin/activate
```

### 3. Instalando as dependências

```bash
pip install -r requirements.txt
```

## ⚙️ 2. Rodando

No terminal rode:
```bash
cd backend
```

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

<h1 align="center">
  <b>🌟 Front-end 🌟</b>
</h1>

## 🐍 1. Instalar as dependências Frontend

Em outro terminal faça:

```bash
npm install
```

## 🖥️ 2. Rodando

```bash
cd frontend
```

```bash
npm run start
```

<h1 align="center">
  <b>Acessando</b>
</h1>

## 🐍 Rotas backend
Para visualizar as rotas backend:

```bash
http://127.0.0.1:8000/docs
```


### 🤖 6. Rodar o Sistema Embarcado
- Faça o upload dos códigos para o ESP32 e ESP32-CAM
- Configure o Wi-Fi e IP da API no código
- ESP32 envia informações para a API automaticamente



