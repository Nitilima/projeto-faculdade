from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers import expense
from app.database import Base, engine
from app.models.expense import Base
from fastapi.middleware.cors import CORSMiddleware

# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API iniciada e conectada ao banco de dados!")
    yield
    print("API finalizada!")

app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expense.router)


@app.get("/")
async def root():
    return {"message": "API funcionandooooo!"}
