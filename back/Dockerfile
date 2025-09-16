FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia primeiro o requirements e schema
COPY requirements.txt .
COPY prisma/schema.prisma ./prisma/

# Instala dependências
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir "prisma==0.11.0"

# Gera o client ANTES de copiar todo o código
RUN prisma generate

# Agora copia todo o resto do código
COPY . .

# Instala outras dependências do requirements
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "8000"]