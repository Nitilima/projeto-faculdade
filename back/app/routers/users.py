from fastapi import APIRouter, HTTPException
from prisma.models import Expense as PrismaExpense
from prisma import Prisma

router = APIRouter(prefix="/expenses", tags=["Expenses"])

db = Prisma()


@router.get("/")
async def get_expenses():
    await db.connect()
    expenses = await db.expense.find_many()
    await db.disconnect()
    return expenses


@router.post("/")
async def create_expense(expense: dict):
    await db.connect()
    new_expense = await db.expense.create(data=expense)
    await db.disconnect()
    return new_expense
