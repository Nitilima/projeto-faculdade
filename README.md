# Vite
- cd cost-project
- npm install
- npm run dev

<!-- # back
- pip install --upgrade pip
- pip install -r requirements.txt
- uvicorn run:app --reload --host 0.0.0.0 --port 8000

Caso de erro no pydantic use: pip install --upgrade "pydantic>=2.0.0" -->

# Prisma
- python -m prisma generate
- python -m prisma migrate dev
- python -m prisma migrate deploy
- migrate dev → cria a migration, aplica no banco e é voltado para desenvolvimento. Ele espera que você ainda possa alterar o schema.
- migrate deploy → só aplica migrations já existentes no banco. Ele não cria novas migrations. É usado em produção ou quando você só quer “subir” as migrations que já estão no projeto.

# Docker
- docker-compose up -d
-----------------------------------------
- docker build -t cost-project .
- docker rm meu-projeto-container
- docker run -d -p 8000:8000 --name meu-projeto-container cost-project
- docker logs -f meu-projeto-container

# biblioteca para usar
- https://recharts.org/en-US
- Lucide