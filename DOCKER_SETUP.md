# 🐳 Guia de Setup Docker

Este documento descreve a configuração Docker do projeto.

## 📦 Arquivos Criados/Modificados

### Backend
- `back/Dockerfile` - Dockerfile de produção otimizado
- `back/Dockerfile.dev` - Dockerfile de desenvolvimento com hot reload
- `back/.dockerignore` - Ignora arquivos desnecessários no build
- `back/.env.example` - Template de variáveis de ambiente

### Frontend
- `project-cost/Dockerfile` - Build multi-stage com Nginx
- `project-cost/nginx.conf` - Configuração do servidor web
- `project-cost/.dockerignore` - Ignora arquivos desnecessários no build

### Orquestração
- `docker-compose.yml` - Ambiente de desenvolvimento completo
- `docker-compose.prod.yml` - Ambiente de produção

## 🏗️ Arquitetura Docker

### Desenvolvimento (docker-compose.yml)

```
┌─────────────────────────────────────────┐
│          Docker Network (app_network)   │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐│
│  │  PostgreSQL  │  │    Backend API  ││
│  │   (5433)     │◄─┤    FastAPI      ││
│  │              │  │    (8000)       ││
│  └──────────────┘  └─────────────────┘│
│         ▲                    ▲         │
│         │                    │         │
│  ┌──────┴──────┐   ┌────────┴────────┐│
│  │   PgAdmin   │   │    Frontend     ││
│  │   (5050)    │   │  React + Vite   ││
│  │             │   │    (5173)       ││
│  └─────────────┘   └─────────────────┘│
└─────────────────────────────────────────┘
```

**Serviços:**
1. **postgres**: Banco de dados com persistência de dados
2. **pgadmin**: Interface web para gerenciar o banco
3. **api**: Backend FastAPI com hot reload e volumes montados
4. **frontend**: React + Vite com hot reload

**Recursos:**
- Hot reload em backend e frontend
- Volumes para persistência de dados
- Health checks para garantir disponibilidade
- Network isolada para comunicação entre serviços

### Produção (docker-compose.prod.yml)

```
┌─────────────────────────────────────────┐
│          Docker Network (app_network)   │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐│
│  │  PostgreSQL  │  │    Backend API  ││
│  │   (internal) │◄─┤    FastAPI      ││
│  │              │  │    (8000)       ││
│  └──────────────┘  └─────────────────┘│
│                            ▲           │
│                            │           │
│                   ┌────────┴────────┐  │
│                   │    Frontend     │  │
│                   │  Nginx (80)     │  │
│                   │                 │  │
│                   └─────────────────┘  │
└─────────────────────────────────────────┘
```

**Diferenças:**
- Frontend servido via Nginx (otimizado)
- Sem hot reload (melhor performance)
- Sem pgAdmin (segurança)
- Usuário não-root no backend
- Variáveis de ambiente via secrets

## 🚀 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar tudo
docker-compose up --build

# Iniciar em background
docker-compose up -d --build

# Parar tudo
docker-compose down

# Parar e limpar volumes (CUIDADO: apaga dados)
docker-compose down -v

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f frontend

# Entrar no container
docker-compose exec api bash
docker-compose exec postgres psql -U dev -d cost

# Rebuild de um serviço específico
docker-compose up -d --build api
```

### Produção

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Status
docker-compose -f docker-compose.prod.yml ps

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Configurações Importantes

### Backend

**Dockerfile.dev** - Desenvolvimento:
- Base: `python:3.11-slim`
- Hot reload habilitado
- Sem otimizações de segurança

**Dockerfile** - Produção:
- Base: `python:3.11-slim`
- Usuário não-root (appuser)
- Build otimizado com cache layers
- Sem ferramentas de desenvolvimento

### Frontend

**Dockerfile** - Multi-stage build:
- **Stage 1 (builder)**: Compila o código React
- **Stage 2 (production)**: Serve via Nginx
- Compressão gzip habilitada
- Cache de assets estáticos
- Headers de segurança

### Volumes

```yaml
volumes:
  postgres_data:      # Dados do PostgreSQL
  pgadmin_data:       # Configurações do pgAdmin
```

**IMPORTANTE**: Para fazer backup do banco, use:
```bash
docker-compose exec postgres pg_dump -U dev cost > backup.sql
```

## 🌐 Portas

### Desenvolvimento
| Serviço   | Porta Externa | Porta Interna |
|-----------|---------------|---------------|
| Frontend  | 5173          | 5173          |
| Backend   | 8000          | 8000          |
| Postgres  | 5433          | 5432          |
| PgAdmin   | 5050          | 80            |

### Produção
| Serviço   | Porta Externa | Porta Interna |
|-----------|---------------|---------------|
| Frontend  | 80            | 80            |
| Backend   | 8000          | 8000          |
| Postgres  | (internal)    | 5432          |

## 🔐 Variáveis de Ambiente

### Backend (.env)
```bash
DATABASE_URL=postgresql://dev:dev@postgres:5432/cost
```

### Produção (.env para docker-compose.prod.yml)
```bash
POSTGRES_DB=cost
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=<strong_password>
DATABASE_URL=postgresql://prod_user:<strong_password>@postgres:5432/cost
```

## ⚠️ Troubleshooting

### Frontend não conecta no backend
- Verifique se o backend está rodando: `docker-compose logs api`
- Confirme a URL da API no código: deve ser `http://localhost:8000`

### Erro de conexão com banco de dados
- Verifique se o postgres está saudável: `docker-compose ps`
- Aguarde o healthcheck: pode levar ~10 segundos
- Verifique a string de conexão no `.env`

### Build muito lento
- Use `.dockerignore` para excluir arquivos grandes
- Aproveite o cache do Docker: não altere `requirements.txt` ou `package.json` desnecessariamente

### Porta já em uso
```bash
# Mude a porta no docker-compose.yml
ports:
  - "3000:5173"  # Em vez de 5173:5173
```

### Limpar tudo e recomeçar
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📊 Monitoramento

### Verificar status
```bash
docker-compose ps
```

### Verificar recursos
```bash
docker stats
```

### Logs em tempo real
```bash
docker-compose logs -f --tail=100
```

## 🎯 Boas Práticas

1. **Sempre use .dockerignore** para builds mais rápidos
2. **Separe ambientes** (dev/prod) com compose files diferentes
3. **Use volumes nomeados** para persistência de dados
4. **Implemente health checks** para garantir disponibilidade
5. **Nunca commite senhas** - use .env e .env.example
6. **Multi-stage builds** reduzem tamanho das imagens
7. **Usuários não-root** aumentam a segurança

## 📚 Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI in Containers](https://fastapi.tiangolo.com/deployment/docker/)
- [Nginx Docker Official Image](https://hub.docker.com/_/nginx)
