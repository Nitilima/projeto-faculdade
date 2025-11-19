

from app.models.expense import Category
from app.database import SessionLocal
import sys
import os


sys.path.insert(0, os.path.join(os.path.dirname(
    os.path.abspath(__file__)), '..', 'back'))


def seed_categories():
    db = SessionLocal()

    categories_data = [
        {
            "name": "Energia Elétrica",
            "carbon_footprint": 0.25,
            "sustainability_level": "high"
        },
        {
            "name": "Combustível/Diesel",
            "carbon_footprint": 0.60,
            "sustainability_level": "high"
        },
        {
            "name": "Manutenção de Equipamentos",
            "carbon_footprint": 0.12,
            "sustainability_level": "medium"
        },
        {
            "name": "Água Industrial",
            "carbon_footprint": 0.08,
            "sustainability_level": "medium"
        },
        {
            "name": "Material de Escritório",
            "carbon_footprint": 0.10,
            "sustainability_level": "medium"
        },
        {
            "name": "Gestão de Resíduos",
            "carbon_footprint": 0.18,
            "sustainability_level": "medium"
        },
        {
            "name": "Tecnologia e TI",
            "carbon_footprint": 0.15,
            "sustainability_level": "low"
        },
        {
            "name": "Segurança Portuária",
            "carbon_footprint": 0.09,
            "sustainability_level": "low"
        },
        {
            "name": "Infraestrutura Portuária",
            "carbon_footprint": 0.20,
            "sustainability_level": "medium"
        },
        {
            "name": "Refrigeração de Reefers",
            "carbon_footprint": 0.45,
            "sustainability_level": "high"
        }
    ]

    print("Populando categorias com dados de sustentabilidade...")

    for cat_data in categories_data:

        existing = db.query(Category).filter(
            Category.name == cat_data["name"]).first()

        if existing:

            existing.carbon_footprint = cat_data["carbon_footprint"]
            existing.sustainability_level = cat_data["sustainability_level"]
            print(f"Atualizado: {cat_data['name']}")
        else:

            category = Category(**cat_data)
            db.add(category)
            print(f"Criado: {cat_data['name']}")

    db.commit()
    print("\nCategorias populadas com sucesso!")
    db.close()


if __name__ == "__main__":
    seed_categories()
