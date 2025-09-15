# Base: Python 3.11 slim
FROM python:3.10-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia o requirements primeiro (para cache de build)
COPY requirements.txt .

# Atualiza pip e instala dependências
RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copia todo o código
COPY . .

# Gerar Prisma Client durante a build
RUN prisma generate

# Expõe a porta que o uvicorn vai usar
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "8000"]
