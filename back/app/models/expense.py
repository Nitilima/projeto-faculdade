from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    carbon_footprint = Column(Float, default=0.0)
    sustainability_level = Column(String, default="medium")


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    date = Column(Date)
    month = Column(String)
    year = Column(Integer)
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(String)
    category = relationship("Category")
