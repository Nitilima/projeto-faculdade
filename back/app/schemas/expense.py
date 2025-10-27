from pydantic import BaseModel
from datetime import date


class ExpenseBase(BaseModel):
    amount: float
    description: str | None = None
    date: date
    category_id: str


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: str
    month: str
    year: int

    class Config:
        orm_mode = True
