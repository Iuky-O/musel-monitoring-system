# 🎨📡 Sistema de Monitoramento e Interação com Obras de Arte

## 📌 Descrição do Projeto
Este sistema integra hardware (ESP32 e sensores), backend (FastAPI), frontend (JavaScript) e visão computacional para criar uma **experiência interativa em exposições e museus**. Ao detectar um visitante, o sistema exibe informações multimídia sobre a obra em tempo real.

## ⚙️ Tecnologias Utilizadas
- **Backend:** Python 3.9+, FastAPI, Uvicorn, OpenCV, WebSockets, MongoDB, Firebase Storage
- **Frontend:** HTML, CSS, JavaScript (Webpack/Babel)
- **Banco de Dados:** MongoDB + Firebase Storage
- **Embarcado:** ESP32, ESP32-CAM, sensores HC-SR04

## 📁 Estrutura do Projeto
```bash
musel-monitoring-system/
│
├── backend/
│   ├── app/
│   │   ├── api/  # Endpoints
|   |   |    ├── admin #aqui tem: obras.py, sensor.py, visitas.py 
|   |   |    ├── embarcado/
|   |   |    ├── exibicao/ #endpoints de interacao.py
|   |   |    └── ws.py
|
|   |   ├── data/ #Conexão com Banco de dados
|   |   |    └── database.py    
|
│   │   ├── models/        # Modelos de dados
|   |   |    ├── interacao.py
|   |   |    ├── ObraModel.py
|   |   |    ├── Sensor.py
|   |   |    └── VisitModel.py
|
│   │   ├── services/      # Lógicas de negócio
|   |   |    └── interacao_service.py
|
│   │   ├── tests/      # Testes
|
│   │   └── utils/         # Funções auxiliares
│   └── main.py            # Ponto de entrada da API FastAPI
│
├── frontend/
│   ├── public/            # Estáticos
│   |   ├── index.html     #entrada
│   |   └── scripts.js
|
│   ├── src/               # Código fonte (JS, CSS, HTML)
│   |   ├── assets/                # Imagens, ícones, estilos globais
│   |   ├── components/               
│   │   │    ├── VisitaCounter.jsx      # Contagem de pessoas
│   │   │    ├── WebSocket.js           # Tempo real
│   │   │    └── ArtworkDetails.js      #
|
│   |   ├── hook/              
│   │   │    └── useWebSocket.jsx
|
│   |   ├── pages/                 # Páginas do sistema
│   │   │    ├── admin/             # Páginas de administração
│   │   │    │   ├── AdminDashboard.js   # Dashboard de monitoramento
│   │   │    │   ├── CadastroObras.js       # Gerenciamento de obras
│   │   │    │   └── index.jsx
│   │   │    ├── Home/              # Páginas de home
│   │   │    │   ├── Home.js        # Página inicial
│   │   │    │   └── index.js   #
│   │   │    ├── user/              # Páginas de interação com o usuário
│   │   │    │   └── Obra.js        # Detalhes da obra (com visão computacional)
|
│   |   ├── router/                 # Rotas
│   │   │    └── AppRouter.jsx      # Onde fica as rotas
|
│   |   ├── style/                 # Estilos
│   │   │    └── index.css      # Onde fica os estilos
|
│   │   ├── App.js                 # Componente principal (roteamento)
│   │   └── index.js               # Ponto de entrada
│   └── tsconfig.json
|
├── .venv
├── .gitignore
├── README.md
├── requirements.txt   # Dependências Python
├── package.json       # Dependências Frontend
├── webpack.config.js
```

## 🚀 Como Executar o Projeto Localmente
### 📥 1. Clonar o Repositório
```bash
git clone https://github.com/Iuky-O/musel-monitoring-system.git
cd musel-monitoring-system
```

### 🐍 2. Configurar o Ambiente Python
#### Criar o ambiente virtual

```bash
python -m venv .venv
```
#### Ativar o ambiente virtual
- Linux/Mac:

```bash
source venv/bin/activate
```

- Windows:

```bash
.venv\Scripts\activate
```

#### Instalar as dependências Python
```bash
pip install -r requirements.txt
```

### 3. Instalar as dependências Frontend

```bash
npm install
```
### ⚙️ 4. Rodar o Backend (API FastAPI)
```bash

cd backend

uvicorn app.main:app --reload
```
#### Verifique as rotas em:

```bash
http://127.0.0.1:8000/docs
```

#### Lista de endpoints
```bash
Admin-Obras

GET - http://127.0.0.1:8000/admin/obras/
POST - http://127.0.0.1:8000/admin/obras/
GET - http://127.0.0.1:8000/admin/obras/{id}
PUT - http://127.0.0.1:8000/admin/obras/{id}
PATCH - http://127.0.0.1:8000/admin/obras/{id}
DELETE - http://127.0.0.1:8000/admin/obras/{id}
```
```bash
Interações

POST -http://127.0.0.1:8000/interacao/obras/{obra_id}/comentar
POST - http://127.0.0.1:8000/interacao/obras/{obra_id}/curtir
```
```bash
Admin-Obras

POST - http://127.0.0.1:8000/admin/visitas/
GET - http://127.0.0.1:8000/admin/visitas/{id}
```
A API estará disponível em http://localhost:8000

### 🖥️ 5. Rodar o Frontendcd
```bash
cd frontend

npm run start
```
Interface acessível em http://localhost:8080

#### Lista de rotas
```bash
Admin

http://localhost:3000/
http://localhost:3000/#/admin/
http://localhost:3000/#/admin/cadastro
http://localhost:3000/#/admin/lista

User
http://localhost:3000/#/user/obra

```

### 🤖 6. Rodar o Sistema Embarcado
- Faça o upload dos códigos para o ESP32 e ESP32-CAM
- Configure o Wi-Fi e IP da API no código
- ESP32 envia informações para a API automaticamente

### 7. Como testar os Endpoints

No 


