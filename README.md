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
│   │   ├── api/           # Endpoints
│   │   ├── models/        # Modelos de dados
│   │   ├── services/      # Lógicas de negócio
│   │   └── utils/         # Funções auxiliares
│   ├── main.py            # Ponto de entrada da API FastAPI
│
├── frontend/
│   ├── public/            # Estáticos
│   ├── src/               # Código fonte (JS, CSS, HTML)
│   ├── src/
│       ├── assets/                # Imagens, ícones, estilos globais
│       ├── pages/                 # Páginas do sistema
│   │   │    ├── admin/             # Páginas de administração
│   │   │    │   ├── Dashboard.js   # Dashboard de monitoramento
│   │   │    │   ├── Obras.js       # Gerenciamento de obras
│   │   │    │   └── Visao.js       # Visão computacional (câmera e reconhecimento)
│   │   │    ├── user/              # Páginas de interação com o usuário
│   │   │    │   ├── Home.js        # Página inicial
│   │   │    │   ├── Obra.js        # Detalhes da obra (com visão computacional)
│   │   │    │   └── Interacao.js   # Interação com a obra (quiz, etc.)
│   │   ├── App.js                 # Componente principal (roteamento)
│   │   ├── index.js               # Ponto de entrada
│
├── scripts/               # Scripts auxiliares
├── tests/                 # Testes automatizados
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
python -m venv venv
```
#### Ativar o ambiente virtual
- Linux/Mac:

```bash
source venv/bin/activate
```

- Windows:

```bash
venv\Scripts\activate
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
uvicorn backend.main:app --reload
```
A API estará disponível em http://localhost:8000

### 🖥️ 5. Rodar o Frontend
```bash
npm run start
```
Interface acessível em http://localhost:8080

### 🤖 6. Rodar o Sistema Embarcado
- Faça o upload dos códigos para o ESP32 e ESP32-CAM
- Configure o Wi-Fi e IP da API no código
- ESP32 envia informações para a API automaticamente



