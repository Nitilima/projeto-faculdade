from pydantic import BaseModel
from datetime import date


class ExpenseBase(BaseModel):
    amount: float
    description: str | None = None
    date: date
    category_id: int


class ExpenseCreate(ExpenseBase):
    pass


class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class ExpenseResponse(ExpenseBase):
    id: str
    month: str
    year: int
    user_id: str
    category: CategoryResponse

    class Config:
        orm_mode = True
