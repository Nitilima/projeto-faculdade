from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, List
from uuid import UUID

# Base model para User


class UserBase(BaseModel):
    email: EmailStr
    name: str
    company: Optional[str] = None

# Model para criar User (request)


class UserCreate(UserBase):
    password: str

# Model para response (sem password)


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Model para update


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    company: Optional[str] = None
    is_active: Optional[bool] = None

# Model para login


class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model com relações (se necessário)


class UserWithRelations(UserResponse):
    expenses: Optional[List] = None
    categories: Optional[List] = None
    budgets: Optional[List] = None
    reports: Optional[List] = None
    settings: Optional[dict] = None
