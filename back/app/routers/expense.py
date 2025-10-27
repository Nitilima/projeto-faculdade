from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.expense import Expense, Category
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/expenses", tags=["Expenses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET /expenses
@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()


# POST /expenses
@router.post("/create-expense", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    date_obj = expense.date
    new_expense = Expense(
        id=str(uuid.uuid4()),
        amount=expense.amount,
        description=expense.description,
        date=date_obj,
        month=date_obj.strftime("%m"),
        year=date_obj.year,
        category_id=expense.category_id,
        user_id="user-test-id"
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

# GET/categories


@router.get("/categories")
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

# POST/categories


@router.post("/create-category")
def create_category(name: str, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já existe")
    category = Category(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/expenses/monthly")
def monthly_expenses(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = (
        db.query(func.to_char(Expense.date, "Mon").label(
            "month"), func.sum(Expense.value).label("gastos"))
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [{"month": r.month, "gastos": float(r.gastos)} for r in results]
