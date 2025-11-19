# Project Cost - Sistema de Gestão Sustentável Portuária

Sistema web para gerenciamento de despesas e análise de sustentabilidade em operações portuárias

## Arquitetura

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Banco de Dados**: PostgreSQL 15
- **ORM**: SQLAlchemy
- **Validação**: Pydantic

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: TailwindCSS
- **Gráficos**: Recharts
- **Ícones**: Lucide React

### DevOps
- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Gerenciamento DB**: pgAdmin 4

## Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Opção 1: Usando Docker

```bash
# Clone o repositório
git clone <url-do-repositório>
cd project

# Inicie todos os serviços
docker-compose up --build

# Ou em modo background
docker-compose up -d --build
```

**Serviços disponíveis:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- pgAdmin: http://localhost:5050

**Credenciais pgAdmin:**
- Email: admin@dev.com
- Senha: admin123

**Banco de Dados:**
- Host: postgres (dentro do Docker) ou localhost (externo)
- Porta: 5433 (externa) / 5432 (interna)
- Usuário: dev
- Senha: dev
- Database: cost

### Opção 2: Desenvolvimento Local (Sem Docker)

#### Backend
```bash
cd back

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar servidor
uvicorn run:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd project-cost

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Despesas
- `GET /expenses/` - Lista todas as despesas
- `POST /expenses/create-expense` - Cria nova despesa
- `GET /expenses/monthly` - Retorna gastos mensais agregados

### Categorias
- `GET /expenses/categories` - Lista todas as categorias
- `POST /expenses/create-category` - Cria nova categoria

**Documentação completa:** http://localhost:8000/docs

## 📚 Bibliotecas Principais

### Backend
- FastAPI - Framework web
- SQLAlchemy - ORM
- Pydantic - Validação de dados
- Alembic - Migrações de banco
- Uvicorn - Servidor ASGI
- psycopg2 - Driver PostgreSQL

### Frontend
- React - Biblioteca UI
- TypeScript - Tipagem estática
- Vite - Build tool
- TailwindCSS - Framework CSS
- Recharts - Biblioteca de gráficos
- Lucide React - Ícones

**Documentação adicional:**
- [Recharts Documentation](https://recharts.org/en-US)
- [Lucide Icons](https://lucide.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)