from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.expense import Expense, Category
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    CategoryAnalysis,
    SustainabilityReport,
    CarbonEstimateRequest,
    CarbonEstimateResponse
)
from app.services.carbon_interface import (
    carbon_service,
    ElectricityUnit,
    FuelType,
    FuelUnit
)
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
def create_category(
    name: str,
    carbon_footprint: float = 0.0,
    sustainability_level: str = "medium",
    db: Session = Depends(get_db)
):
    existing = db.query(Category).filter(Category.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria já existe")
    category = Category(
        name=name,
        carbon_footprint=carbon_footprint,
        sustainability_level=sustainability_level
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


# DELETE /categories/{category_id}
@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):

    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    expense_count = db.query(Expense).filter(
        Expense.category_id == category_id).count()

    if expense_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Não é possível deletar esta categoria. Existem {expense_count} despesa(s) vinculada(s) a ela. Delete as despesas primeiro."
        )

    db.delete(category)
    db.commit()

    return {
        "message": f"Categoria '{category.name}' deletada com sucesso",
        "deleted_category": {
            "id": category.id,
            "name": category.name
        }
    }


@router.get("/expenses/monthly")
def monthly_expenses(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = (
        db.query(func.to_char(Expense.date, "Mon").label(
            "month"), func.sum(Expense.amount).label("gastos"))
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [{"month": r.month, "gastos": float(r.gastos)} for r in results]


@router.get("/analysis/by-category", response_model=list[CategoryAnalysis])
def get_category_analysis(db: Session = Depends(get_db)):
    from sqlalchemy import func

    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0

    results = (
        db.query(
            Category.id,
            Category.name,
            Category.carbon_footprint,
            Category.sustainability_level,
            func.sum(Expense.amount).label("total"),
            func.count(Expense.id).label("count")
        )
        .join(Expense, Category.id == Expense.category_id)
        .group_by(Category.id, Category.name, Category.carbon_footprint, Category.sustainability_level)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )

    analysis = []
    for r in results:
        percentage = (r.total / total_expenses *
                      100) if total_expenses > 0 else 0
        carbon_emissions = r.total * r.carbon_footprint

        analysis.append(CategoryAnalysis(
            category_id=r.id,
            category_name=r.name,
            total_amount=float(r.total),
            percentage=round(percentage, 2),
            carbon_emissions=round(carbon_emissions, 2),
            sustainability_level=r.sustainability_level,
            expense_count=r.count
        ))

    return analysis


@router.get("/recommendations/{category_id}", response_model=SustainabilityReport)
def get_recommendations(category_id: int, db: Session = Depends(get_db)):
    from sqlalchemy import func

    # Buscar categoria
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    total_spending = db.query(func.sum(Expense.amount)).filter(
        Expense.category_id == category_id
    ).scalar() or 0

    current_co2 = total_spending * category.carbon_footprint

    suggestion = generate_simple_suggestion(category.name, current_co2)

    return SustainabilityReport(
        category_id=category.id,
        category_name=category.name,
        current_spending=float(total_spending),
        current_co2=round(current_co2, 2),
        suggestion=suggestion
    )


def generate_simple_suggestion(category_name: str, co2: float) -> str:

    if "energia" in category_name.lower():
        return "Considere trocar para iluminação LED e instalar painéis solares para reduzir custos e emissões."

    elif "combustivel" in category_name.lower() or "diesel" in category_name.lower():
        return "Equipamentos elétricos ou híbridos podem reduzir significativamente o consumo de combustível."

    elif "manutencao" in category_name.lower() or "manutenção" in category_name.lower():
        return "Manutenção preditiva com sensores pode evitar quebras e prolongar vida útil dos equipamentos."

    elif "agua" in category_name.lower() or "água" in category_name.lower():
        return "Captação de água da chuva e sistemas de reuso podem reduzir o consumo."

    elif "papel" in category_name.lower() or "escritorio" in category_name.lower() or "material" in category_name.lower():
        return "Digitalização de documentos elimina custos com papel e agiliza processos."

    elif "residuo" in category_name.lower() or "resíduo" in category_name.lower():
        return "Separação e venda de materiais recicláveis pode gerar receita adicional."

    else:
        return "Uma auditoria ambiental pode identificar oportunidades de economia e redução de emissões."


# Novos endpoints usando Carbon Interface API

@router.post("/carbon/estimate", response_model=CarbonEstimateResponse)
async def estimate_carbon_emissions(request: CarbonEstimateRequest):
    """
    Estima emissões de carbono usando Carbon Interface API

    Tipos suportados:
    - electricity: Consumo de energia elétrica
    - fuel: Combustão de combustível (diesel, gasolina, etc)
    - shipping: Transporte de carga
    """

    if request.estimate_type == "electricity":
        if not request.electricity_value or not request.electricity_unit:
            raise HTTPException(
                status_code=400,
                detail="electricity_value e electricity_unit são obrigatórios para tipo 'electricity'"
            )

        # Tentar usar a API
        result = await carbon_service.estimate_electricity(
            electricity_value=request.electricity_value,
            electricity_unit=ElectricityUnit(request.electricity_unit),
            country=request.country or "br",
            state=request.state
        )

        # Se API falhar, usar fallback
        if result is None:
            # Converter para kWh se necessário
            kwh_value = request.electricity_value
            if request.electricity_unit == "mwh":
                kwh_value = request.electricity_value * 1000

            carbon_kg = carbon_service.estimate_electricity_fallback(
                electricity_kwh=kwh_value,
                region=request.country or "br"
            )

            return CarbonEstimateResponse(
                carbon_g=carbon_kg * 1000,
                carbon_kg=carbon_kg,
                carbon_lb=carbon_kg * 2.20462,
                carbon_mt=carbon_kg / 1000,
                estimate_type="electricity",
                source="fallback"
            )

        return CarbonEstimateResponse(
            carbon_g=result.get("carbon_g", 0),
            carbon_kg=result.get("carbon_kg", 0),
            carbon_lb=result.get("carbon_lb", 0),
            carbon_mt=result.get("carbon_mt", 0),
            estimate_type="electricity",
            source="carbon_interface_api"
        )

    elif request.estimate_type == "fuel":
        if not request.fuel_type or not request.fuel_value or not request.fuel_unit:
            raise HTTPException(
                status_code=400,
                detail="fuel_type, fuel_value e fuel_unit são obrigatórios para tipo 'fuel'"
            )

        result = await carbon_service.estimate_fuel_combustion(
            fuel_type=FuelType(request.fuel_type),
            fuel_value=request.fuel_value,
            fuel_unit=FuelUnit(request.fuel_unit)
        )

        # Fallback para diesel
        if result is None and request.fuel_type == "dfo":  # Diesel
            # Converter para litros se necessário
            liters = request.fuel_value
            if request.fuel_unit == "gallon":
                liters = request.fuel_value * 3.78541

            carbon_kg = carbon_service.estimate_diesel_fallback(
                diesel_liters=liters)

            return CarbonEstimateResponse(
                carbon_g=carbon_kg * 1000,
                carbon_kg=carbon_kg,
                carbon_lb=carbon_kg * 2.20462,
                carbon_mt=carbon_kg / 1000,
                estimate_type="fuel",
                source="fallback"
            )

        if result is None:
            raise HTTPException(
                status_code=503,
                detail="API Carbon Interface indisponível e sem fallback para este tipo de combustível"
            )

        return CarbonEstimateResponse(
            carbon_g=result.get("carbon_g", 0),
            carbon_kg=result.get("carbon_kg", 0),
            carbon_lb=result.get("carbon_lb", 0),
            carbon_mt=result.get("carbon_mt", 0),
            estimate_type="fuel",
            source="carbon_interface_api"
        )

    elif request.estimate_type == "shipping":
        if not all([request.weight_value, request.weight_unit,
                   request.distance_value, request.distance_unit]):
            raise HTTPException(
                status_code=400,
                detail="weight_value, weight_unit, distance_value e distance_unit são obrigatórios para tipo 'shipping'"
            )

        result = await carbon_service.estimate_shipping(
            weight_value=request.weight_value,
            weight_unit=request.weight_unit,
            distance_value=request.distance_value,
            distance_unit=request.distance_unit,
            transport_method=request.transport_method or "ship"
        )

        if result is None:
            raise HTTPException(
                status_code=503,
                detail="API Carbon Interface indisponível"
            )

        return CarbonEstimateResponse(
            carbon_g=result.get("carbon_g", 0),
            carbon_kg=result.get("carbon_kg", 0),
            carbon_lb=result.get("carbon_lb", 0),
            carbon_mt=result.get("carbon_mt", 0),
            estimate_type="shipping",
            source="carbon_interface_api"
        )

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de estimativa inválido: {request.estimate_type}. Use: electricity, fuel ou shipping"
        )


@router.get("/carbon/test")
async def test_carbon_api():
    is_connected = await carbon_service.test_connection()

    return {
        "connected": is_connected,
        "message": "API Carbon Interface conectada com sucesso!" if is_connected else "API não configurada ou indisponível. Usando cálculos fallback.",
        "api_key_configured": carbon_service.api_key is not None
    }
