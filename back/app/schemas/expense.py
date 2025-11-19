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
    carbon_footprint: float = 0.0
    sustainability_level: str = "medium"

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


class CategoryAnalysis(BaseModel):
    category_id: int
    category_name: str
    total_amount: float
    percentage: float
    carbon_emissions: float
    sustainability_level: str
    expense_count: int


class SustainabilityReport(BaseModel):
    category_id: int
    category_name: str
    current_spending: float
    current_co2: float
    suggestion: str


class CarbonEstimateRequest(BaseModel):

    estimate_type: str

    electricity_value: float | None = None
    electricity_unit: str | None = None
    country: str | None = "br"
    state: str | None = None

    fuel_type: str | None = None
    fuel_value: float | None = None
    fuel_unit: str | None = None

    weight_value: float | None = None
    weight_unit: str | None = None
    distance_value: float | None = None
    distance_unit: str | None = None
    transport_method: str | None = "ship"


class CarbonEstimateResponse(BaseModel):

    carbon_g: float
    carbon_kg: float
    carbon_lb: float
    carbon_mt: float
    estimate_type: str
    source: str
