import { useEffect, useState } from "react";
import { getCategoryAnalysis, type CategoryAnalysis } from "../services/api";
import { TrendingUp, Leaf, AlertTriangle, CheckCircle } from "lucide-react";

export default function Analises() {
  const [categoryData, setCategoryData] = useState<CategoryAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryAnalysis()
      .then((data) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getSustainabilityColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSustainabilityIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-5 h-5" />;
      case "medium":
        return <Leaf className="w-5 h-5" />;
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  const getSustainabilityText = (level: string) => {
    switch (level) {
      case "low":
        return "Baixo Impacto";
      case "medium":
        return "Médio Impacto";
      case "high":
        return "Alto Impacto";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div>
      {/* Ranking de Categorias Mais Custosas */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-[#357ade]" />
          <h2 className="font-semibold text-2xl text-gray-800">
            Top Categorias Mais Custosas
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Análise dos setores com maior impacto financeiro e ambiental
        </p>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Carregando análise...
          </div>
        ) : categoryData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma despesa registrada ainda
          </div>
        ) : (
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div
                key={category.category_id}
                className="bg-white rounded-lg p-6 shadow-md border-l-4 hover:shadow-lg transition-shadow"
                style={{
                  borderLeftColor:
                    index === 0
                      ? "#dc2626"
                      : index === 1
                      ? "#ea580c"
                      : index === 2
                      ? "#f59e0b"
                      : "#357ade",
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#357ade] text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800">
                        {category.category_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.expense_count} despesa(s) registrada(s)
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${getSustainabilityColor(
                      category.sustainability_level
                    )}`}
                  >
                    {getSustainabilityIcon(category.sustainability_level)}
                    <span className="text-sm font-semibold">
                      {getSustainabilityText(category.sustainability_level)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gasto Total</p>
                    <p className="text-2xl font-bold text-[#357ade]">
                      R${" "}
                      {category.total_amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.percentage.toFixed(1)}% do total
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Emissões de CO₂
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {category.carbon_emissions.toFixed(1)} kg
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Impacto ambiental
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Pegada de Carbono
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {(
                        category.carbon_emissions / category.total_amount
                      ).toFixed(3)}{" "}
                      kg/R$
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      CO₂ por real gasto
                    </p>
                  </div>
                </div>

                {/* Barra de progresso percentual */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#357ade] h-2 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
