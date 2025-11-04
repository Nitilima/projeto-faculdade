import { DollarSign, ChartLine, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import EvolucaoGastos from "../components/grafico-dashboard";
import { getDashboardStats } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalGastos: 0,
    totalCategorias: 0,
    mesesRegistrados: 0,
  });

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
        {/* Título principal */}
        <h1 className="font-bold text-3xl text-gray-800 uppercase">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2 leading-relaxed">
          Visão geral dos seus gastos e métricas importantes
        </p>

        {/* Container dos 3 cards lado a lado */}
        <div className="flex flex-row gap-4 mt-4">
          {/* Card 1 */}
          <div className="flex-1 flex justify-between items-center shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-[#f6f6f6]">
            <div className="flex flex-col">
              <p className="text-gray-600 font-semibold">Total de Gastos</p>
              <p className="text-[#357ade] font-bold text-xl">
                R$ {stats.totalGastos.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#357ade] text-white rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-1 flex justify-between items-center shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-[#f6f6f6]">
            <div className="flex flex-col">
              <p className="text-gray-600 font-semibold">Categorias</p>
              <p className="text-[#357ade] font-bold text-xl">
                {stats.totalCategorias}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#357ade] text-white rounded-full">
              <ChartLine className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-1 flex justify-between items-center shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-[#f6f6f6]">
            <div className="flex flex-col">
              <p className="text-gray-600 font-semibold">Meses Registrados</p>
              <p className="text-[#357ade] font-bold text-xl">
                {stats.mesesRegistrados}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-[#357ade] text-white rounded-full">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Novo título */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <h2 className="font-semibold text-2xl text-gray-800">
          Evolução de Gastos por Mês
        </h2>

        {/* Container do gráfico */}
        <div className="p-6 rounded-lg mt-4">
          <EvolucaoGastos />
        </div>
      </div>
    </div>
  );
}
