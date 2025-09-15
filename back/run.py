from fastapi import FastAPI
from app.routers import users

app = FastAPI(title="Cost Management API")

app.include_router(users.router)
