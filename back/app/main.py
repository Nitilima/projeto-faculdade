from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import connect_db, disconnect_db
from .routers import auth, expenses, categories, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    yield
    # Shutdown
    await disconnect_db()

app = FastAPI(
    title="Cost Project API",
    description="API para controle de custos empresariais",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # URLs do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers

app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Cost Project API is running!"}