from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    company: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: str = "#3B82F6"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    is_active: Optional[bool] = None

class CategoryResponse(CategoryBase):
    id: str
    is_active: bool
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    amount: Decimal = Field(..., decimal_places=2, ge=0)
    description: Optional[str] = None
    date: datetime

class ExpenseCreate(ExpenseBase):
    category_id: str
    tag_ids: Optional[List[str]] = []

class ExpenseUpdate(ExpenseBase):
    category_id: Optional[str] = None
    tag_ids: Optional[List[str]] = None

class ExpenseResponse(ExpenseBase):
    id: str
    month: str
    year: int
    category: CategoryResponse
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Tag Schemas
class TagBase(BaseModel):
    name: str
    color: str = "#6B7280"

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None