# Vite
- cd cost-project
- npm install
- npm run dev

# Poetry
- poetry new my-project-name
- poetry install
- poetry add fastapi
- poetry add "uvicorn[standard]"
- poetry add prisma
- poetry add "prisma[fastapi]"
- poetry run uvicorn app.main:app --reload --port 8000
# Prisma
- poetry run prisma init
- poetry run prisma generate
- poetry run prisma migrate dev --name init (roda a migration)
- poetry run prisma db push
- poetry run prisma studio

# Docker

docker-compose up -d