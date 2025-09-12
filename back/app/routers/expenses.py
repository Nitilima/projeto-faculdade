# app/routers/expenses.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from ..database import get_db, Prisma
from ..models.schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from .auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense: ExpenseCreate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Criar nova despesa"""
    
    # Verificar se a categoria pertence ao usuário
    category = await db.category.find_unique(
        where={"id": expense.category_id}
    )
    if not category or category.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    # Calcular mês e ano
    month = expense.date.strftime("%Y-%m")
    year = expense.date.year
    
    # Criar despesa
    new_expense = await db.expense.create(
        data={
            "userId": current_user.id,
            "categoryId": expense.category_id,
            "amount": expense.amount,
            "description": expense.description,
            "date": expense.date,
            "month": month,
            "year": year,
        },
        include={
            "category": True,
            "tags": True
        }
    )
    
    # Conectar tags se fornecidas
    if expense.tag_ids:
        # Verificar se todas as tags pertencem ao usuário
        user_tags = await db.tag.find_many(
            where={
                "id": {"in": expense.tag_ids},
                "userId": current_user.id
            }
        )
        
        if len(user_tags) != len(expense.tag_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more tags not found"
            )
        
        # Conectar tags à despesa
        await db.expense.update(
            where={"id": new_expense.id},
            data={
                "tags": {
                    "connect": [{"id": tag_id} for tag_id in expense.tag_ids]
                }
            }
        )
    
    return new_expense

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category_id: Optional[str] = Query(None),
    month: Optional[str] = Query(None, description="Format: YYYY-MM"),
    year: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Listar despesas do usuário com filtros"""
    
    where_clause = {"userId": current_user.id}
    
    # Aplicar filtros
    if category_id:
        where_clause["categoryId"] = category_id
    
    if month:
        where_clause["month"] = month
    
    if year:
        where_clause["year"] = year
    
    if start_date and end_date:
        where_clause["date"] = {
            "gte": start_date,
            "lte": end_date
        }
    elif start_date:
        where_clause["date"] = {"gte": start_date}
    elif end_date:
        where_clause["date"] = {"lte": end_date}
    
    expenses = await db.expense.find_many(
        where=where_clause,
        include={
            "category": True,
            "tags": True
        },
        order_by={"date": "desc"},
        skip=skip,
        take=limit
    )
    
    return expenses

@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Obter despesa específica"""
    
    expense = await db.expense.find_unique(
        where={"id": expense_id},
        include={
            "category": True,
            "tags": True
        }
    )
    
    if not expense or expense.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: str,
    expense_update: ExpenseUpdate,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Atualizar despesa"""
    
    # Verificar se a despesa existe e pertence ao usuário
    existing_expense = await db.expense.find_unique(
        where={"id": expense_id}
    )
    
    if not existing_expense or existing_expense.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    # Preparar dados para atualização
    update_data = {}
    
    if expense_update.amount is not None:
        update_data["amount"] = expense_update.amount
    
    if expense_update.description is not None:
        update_data["description"] = expense_update.description
    
    if expense_update.date is not None:
        update_data["date"] = expense_update.date
        update_data["month"] = expense_update.date.strftime("%Y-%m")
        update_data["year"] = expense_update.date.year
    
    if expense_update.category_id is not None:
        # Verificar se a categoria pertence ao usuário
        category = await db.category.find_unique(
            where={"id": expense_update.category_id}
        )
        if not category or category.userId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        update_data["categoryId"] = expense_update.category_id
    
    # Atualizar despesa
    updated_expense = await db.expense.update(
        where={"id": expense_id},
        data=update_data,
        include={
            "category": True,
            "tags": True
        }
    )
    
    # Atualizar tags se fornecidas
    if expense_update.tag_ids is not None:
        # Desconectar todas as tags atuais
        await db.expense.update(
            where={"id": expense_id},
            data={
                "tags": {
                    "set": []
                }
            }
        )
        
        if expense_update.tag_ids:
            # Verificar se todas as tags pertencem ao usuário
            user_tags = await db.tag.find_many(
                where={
                    "id": {"in": expense_update.tag_ids},
                    "userId": current_user.id
                }
            )
            
            if len(user_tags) != len(expense_update.tag_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more tags not found"
                )
            
            # Conectar novas tags
            await db.expense.update(
                where={"id": expense_id},
                data={
                    "tags": {
                        "connect": [{"id": tag_id} for tag_id in expense_update.tag_ids]
                    }
                }
            )
    
    return updated_expense

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Deletar despesa"""
    
    # Verificar se a despesa existe e pertence ao usuário
    expense = await db.expense.find_unique(
        where={"id": expense_id}
    )
    
    if not expense or expense.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    await db.expense.delete(where={"id": expense_id})

@router.get("/stats/monthly")
async def get_monthly_stats(
    year: Optional[int] = Query(None),
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Obter estatísticas mensais"""
    
    where_clause = {"userId": current_user.id}
    if year:
        where_clause["year"] = year
    
    # Buscar despesas agrupadas por mês
    expenses = await db.expense.find_many(
        where=where_clause,
        include={"category": True}
    )
    
    # Agrupar por mês
    monthly_stats = {}
    category_stats = {}
    
    for expense in expenses:
        month = expense.month
        category = expense.category.name
        amount = float(expense.amount)
        
        # Estatísticas mensais
        if month not in monthly_stats:
            monthly_stats[month] = {"month": month, "total": 0}
        monthly_stats[month]["total"] += amount
        
        # Estatísticas por categoria
        if category not in category_stats:
            category_stats[category] = {"category": category, "amount": 0}
        category_stats[category]["amount"] += amount
    
    return {
        "monthly_data": list(monthly_stats.values()),
        "category_data": list(category_stats.values()),
        "total_expenses": sum(stat["total"] for stat in monthly_stats.values())
    }

@router.get("/stats/summary")
async def get_expense_summary(
    db: Prisma = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Resumo geral das despesas"""
    
    # Total de despesas
    total_expenses = await db.expense.aggregate(
        where={"userId": current_user.id},
        _sum={"amount": True},
        _count=True
    )
    
    # Total de categorias
    total_categories = await db.category.count(
        where={"userId": current_user.id, "isActive": True}
    )
    
    # Despesas por mês (últimos 12 meses)
    expenses_by_month = await db.expense.group_by(
        by=["month"],
        where={"userId": current_user.id},
        _sum={"amount": True},
        order_by={"month": "desc"},
        take=12
    )
    
    return {
        "total_amount": float(total_expenses._sum.amount or 0),
        "total_count": total_expenses._count,
        "total_categories": total_categories,
        "monthly_breakdown": [
            {
                "month": item.month,
                "total": float(item._sum.amount or 0)
            }
            for item in expenses_by_month
        ]
    }