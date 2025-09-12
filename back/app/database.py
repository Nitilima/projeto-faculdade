import asyncio
from prisma import Prisma
from typing import AsyncGenerator

db = Prisma()

async def connect_db():

    await db.connect()

async def disconnect_db():

    await db.disconnect()

async def get_db() -> AsyncGenerator[Prisma, None]:

    try:
        yield db
    finally:
        pass 