# 💰 Project Cost - Sistema de Controle de Gastos

Sistema web para gerenciamento e análise de despesas pessoais, desenvolvido como projeto acadêmico.

## 📋 Sobre o Projeto

Sistema completo de controle financeiro que permite:
- ✅ Cadastro e gerenciamento de despesas
- 📊 Visualização de gastos por categoria
- 📈 Análise de tendências e evolução de gastos
- 🎯 Dashboard com métricas em tempo real

## 🏗️ Arquitetura

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
- **Gerenciamento BD**: pgAdmin 4

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Opção 1: Usando Docker (Recomendado)

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

## 📁 Estrutura do Projeto

```
project/
├── back/                          # Backend FastAPI
│   ├── app/
│   │   ├── models/               # Modelos do banco de dados
│   │   ├── routers/              # Endpoints da API
│   │   ├── schemas/              # Schemas Pydantic
│   │   └── database.py           # Configuração do banco
│   ├── Dockerfile                # Dockerfile de produção
│   ├── Dockerfile.dev            # Dockerfile de desenvolvimento
│   ├── requirements.txt          # Dependências Python
│   └── run.py                    # Ponto de entrada da aplicação
│
├── project-cost/                  # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── pages/                # Páginas da aplicação
│   │   ├── services/             # Serviços e chamadas API
│   │   └── App.tsx               # Componente principal
│   ├── Dockerfile                # Dockerfile de produção (Nginx)
│   ├── nginx.conf                # Configuração Nginx
│   └── package.json              # Dependências Node.js
│
├── .github/
│   └── workflows/
│       └── ci.yml                # Pipeline CI/CD
│
├── docker-compose.yml            # Compose para desenvolvimento
├── docker-compose.prod.yml       # Compose para produção
└── README.md                     # Este arquivo
```

## 🔌 API Endpoints

### Despesas
- `GET /expenses/` - Lista todas as despesas
- `POST /expenses/create-expense` - Cria nova despesa
- `GET /expenses/monthly` - Retorna gastos mensais agregados

### Categorias
- `GET /expenses/categories` - Lista todas as categorias
- `POST /expenses/create-category` - Cria nova categoria

**Documentação completa:** http://localhost:8000/docs

## 🛠️ Scripts Úteis

### Docker
```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpa banco de dados)
docker-compose down -v

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f frontend

# Reconstruir serviços
docker-compose up --build

# Executar comando em um container
docker-compose exec api bash
docker-compose exec postgres psql -U dev -d cost
```

### Produção
```bash
# Build e execução em modo produção
docker-compose -f docker-compose.prod.yml up --build -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Parar produção
docker-compose -f docker-compose.prod.yml down
```

## 🧪 Testes e CI/CD

O projeto utiliza GitHub Actions para CI/CD:

- **Backend**: Linting com flake8 e testes com pytest
- **Frontend**: Linting com ESLint e build
- **Docker**: Build das imagens em produção

Para executar localmente:

```bash
# Backend
cd back
flake8 .
pytest --cov=app

# Frontend
cd project-cost
npm run lint
npm run build
```

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

## 🤝 Contribuindo

Este é um projeto acadêmico. Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Projeto desenvolvido para fins acadêmicos.

## 👥 Autores

Desenvolvido como projeto de faculdade.

---

**Documentação adicional:**
- [Recharts Documentation](https://recharts.org/en-US)
- [Lucide Icons](https://lucide.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)