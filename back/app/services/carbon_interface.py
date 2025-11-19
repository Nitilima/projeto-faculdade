"""
Serviço de integração com Carbon Interface API
Documentação: https://docs.carboninterface.com/
"""

import httpx
import os
from typing import Optional, Dict, Any
from enum import Enum


class FuelType(str, Enum):

    BIT_COAL = "bit"
    DIESEL = "dfo"
    JETFUEL = "jf"
    KEROSENE = "ker"
    LIGNITE_COAL = "lig"
    MS_COAL = "msc"
    NATURAL_GAS = "ng"
    PETROL_GASOLINE = "pc"
    PG = "pg"
    SUB_BIT_COAL = "sub"
    TDF = "tdf"
    WASTE_OIL = "wo"


class ElectricityUnit(str, Enum):

    KWH = "kwh"
    MWH = "mwh"


class FuelUnit(str, Enum):
    """Unidades de combustível"""
    # Volume
    GALLON = "gallon"
    LITER = "liter"
    # Massa
    KG = "kg"
    POUND = "lb"
    TON = "ton"
    # Energia
    BTU = "btu"


class CarbonInterfaceService:

    BASE_URL = "https://www.carboninterface.com/api/v1"

    def __init__(self, api_key: Optional[str] = None):

        self.api_key = api_key or os.getenv("CARBON_INTERFACE_API_KEY")
        if not self.api_key:
            print(
                "⚠️  CARBON_INTERFACE_API_KEY não configurada. Usando cálculos estimados.")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        } if self.api_key else {}

    async def test_connection(self) -> bool:

        if not self.api_key:
            return False

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.BASE_URL}/auth",
                    headers=self.headers,
                    timeout=10.0
                )
                return response.status_code == 200
        except Exception as e:
            print(f" Erro ao testar conexão com Carbon Interface: {e}")
            return False

    async def estimate_electricity(
        self,
        electricity_value: float,
        electricity_unit: ElectricityUnit = ElectricityUnit.KWH,
        country: str = "br",  # Brasil por padrão
        state: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:

        if not self.api_key:
            return None

        payload = {
            "type": "electricity",
            "electricity_unit": electricity_unit.value,
            "electricity_value": electricity_value,
            "country": country.lower()
        }

        if state:
            payload["state"] = state.lower()

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.BASE_URL}/estimates",
                    headers=self.headers,
                    json=payload,
                    timeout=15.0
                )

                if response.status_code == 201:
                    data = response.json()
                    return data.get("data", {}).get("attributes", {})
                else:
                    print(
                        f"⚠️  Erro na API Carbon Interface: {response.status_code} - {response.text}")
                    return None

        except Exception as e:
            print(f" Erro ao calcular emissões de eletricidade: {e}")
            return None

    async def estimate_fuel_combustion(
        self,
        fuel_type: FuelType,
        fuel_value: float,
        fuel_unit: FuelUnit
    ) -> Optional[Dict[str, Any]]:

        if not self.api_key:
            return None

        payload = {
            "type": "fuel_combustion",
            "fuel_source_type": fuel_type.value,
            "fuel_source_unit": fuel_unit.value,
            "fuel_source_value": fuel_value
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.BASE_URL}/estimates",
                    headers=self.headers,
                    json=payload,
                    timeout=15.0
                )

                if response.status_code == 201:
                    data = response.json()
                    return data.get("data", {}).get("attributes", {})
                else:
                    print(
                        f"⚠️  Erro na API Carbon Interface: {response.status_code} - {response.text}")
                    return None

        except Exception as e:
            print(f" Erro ao calcular emissões de combustível: {e}")
            return None

    async def estimate_shipping(
        self,
        weight_value: float,
        weight_unit: str,
        distance_value: float,
        distance_unit: str,
        transport_method: str = "ship"
    ) -> Optional[Dict[str, Any]]:

        if not self.api_key:
            return None

        payload = {
            "type": "shipping",
            "weight_value": weight_value,
            "weight_unit": weight_unit,
            "distance_value": distance_value,
            "distance_unit": distance_unit,
            "transport_method": transport_method
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.BASE_URL}/estimates",
                    headers=self.headers,
                    json=payload,
                    timeout=15.0
                )

                if response.status_code == 201:
                    data = response.json()
                    return data.get("data", {}).get("attributes", {})
                else:
                    print(
                        f"⚠️  Erro na API Carbon Interface: {response.status_code} - {response.text}")
                    return None

        except Exception as e:
            print(f" Erro ao calcular emissões de transporte: {e}")
            return None

    def estimate_electricity_fallback(
        self,
        electricity_kwh: float,
        region: str = "br"
    ) -> float:

        emission_factors = {
            "br": 0.0817,
            "us": 0.3855,
            "cn": 0.5810,
            "de": 0.3110,
            "uk": 0.2330,
            "in": 0.7080,
            "world": 0.4750
        }

        factor = emission_factors.get(
            region.lower(), emission_factors["world"])
        return electricity_kwh * factor

    def estimate_diesel_fallback(
        self,
        diesel_liters: float
    ) -> float:

        return diesel_liters * 2.68


carbon_service = CarbonInterfaceService()
