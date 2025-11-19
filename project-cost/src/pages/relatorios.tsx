import { useState } from "react";
import { getDespesas } from "../services/api";
import { FileText, Download, Calendar } from "lucide-react";

export default function Relatorios() {
  const [loading, setLoading] = useState(false);

  const generateMonthlyReport = async () => {
    setLoading(true);
    try {
      const despesas = await getDespesas();

      // Agrupar por mês
      const monthlyData: Record<string, { total: number; count: number }> = {};

      despesas.forEach((despesa) => {
        const monthYear = `${despesa.month}/${despesa.year}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { total: 0, count: 0 };
        }
        monthlyData[monthYear].total += despesa.amount;
        monthlyData[monthYear].count += 1;
      });

      // Criar relatório
      let report = "RELATÓRIO MENSAL DE GASTOS\n";
      report += "=" + "=".repeat(50) + "\n\n";

      Object.entries(monthlyData)
        .sort()
        .forEach(([month, data]) => {
          report += `${month}: R$ ${data.total.toFixed(2)} (${
            data.count
          } despesas)\n`;
        });

      // Mostrar em uma nova janela
      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório mensal");
    } finally {
      setLoading(false);
    }
  };

  const generateAnnualReport = async () => {
    setLoading(true);
    try {
      const despesas = await getDespesas();

      // Agrupar por ano
      const annualData: Record<
        string,
        { total: number; count: number; byCategory: Record<string, number> }
      > = {};

      despesas.forEach((despesa) => {
        const year = despesa.year.toString();
        if (!annualData[year]) {
          annualData[year] = { total: 0, count: 0, byCategory: {} };
        }
        annualData[year].total += despesa.amount;
        annualData[year].count += 1;

        const category = despesa.category.name;
        if (!annualData[year].byCategory[category]) {
          annualData[year].byCategory[category] = 0;
        }
        annualData[year].byCategory[category] += despesa.amount;
      });

      // Criar relatório
      let report = "RELATÓRIO ANUAL DE GASTOS\n";
      report += "=" + "=".repeat(50) + "\n\n";

      Object.entries(annualData)
        .sort()
        .forEach(([year, data]) => {
          report += `\nANO ${year}\n`;
          report += "-".repeat(50) + "\n";
          report += `Total: R$ ${data.total.toFixed(2)}\n`;
          report += `Despesas: ${data.count}\n`;
          report += `Média: R$ ${(data.total / data.count).toFixed(2)}\n\n`;
          report += "Por Categoria:\n";

          Object.entries(data.byCategory)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, amount]) => {
              const percentage = (amount / data.total) * 100;
              report += `  ${category}: R$ ${amount.toFixed(
                2
              )} (${percentage.toFixed(1)}%)\n`;
            });
        });

      // Mostrar em uma nova janela
      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao gerar relatório anual");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    setLoading(true);
    try {
      const despesas = await getDespesas();

      // Cabeçalho CSV
      let csv = "Data,Categoria,Descrição,Valor,Mês,Ano,CO2 (kg)\n";

      // Dados
      despesas.forEach((despesa) => {
        const co2 = despesa.amount * despesa.category.carbon_footprint;
        csv += `${despesa.date},${despesa.category.name},"${
          despesa.description || ""
        }",${despesa.amount},${despesa.month},${despesa.year},${co2.toFixed(
          2
        )}\n`;
      });

      // Download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `despesas_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
        {/* Título principal */}
        <h1 className="font-bold text-3xl text-gray-800">Relatórios</h1>

        <p className="text-lg text-gray-800 mt-2 leading-relaxed">
          Visualize e exporte relatórios detalhados dos seus gastos
        </p>

        {/* Container dos cards */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[300px] shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-[#357ade]" />
              <h3 className="font-semibold text-xl text-gray-800">
                Relatório Mensal
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Visualize seus gastos agrupados por mês
            </p>
            <button
              onClick={generateMonthlyReport}
              disabled={loading}
              className="bg-[#357ade] text-white px-4 py-2 rounded-lg hover:bg-[#2868c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {loading ? "Gerando..." : "Gerar Relatório"}
            </button>
          </div>

          <div className="flex-1 min-w-[300px] shadow-lg p-6 rounded-lg border-l-4 border-[#62b8bc] bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-[#62b8bc]" />
              <h3 className="font-semibold text-xl text-gray-800">
                Relatório Anual
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Análise completa do ano com estatísticas por categoria
            </p>
            <button
              onClick={generateAnnualReport}
              disabled={loading}
              className="bg-[#62b8bc] text-white px-4 py-2 rounded-lg hover:bg-[#4fa5a9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {loading ? "Gerando..." : "Gerar Relatório"}
            </button>
          </div>

          <div className="flex-1 min-w-[300px] shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-6 h-6 text-[#357ade]" />
              <h3 className="font-semibold text-xl text-gray-800">
                Exportar Dados
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Exporte seus dados em formato CSV com informações de CO₂
            </p>
            <button
              onClick={exportToCSV}
              disabled={loading}
              className="bg-[#357ade] text-white px-4 py-2 rounded-lg hover:bg-[#2868c7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {loading ? "Exportando..." : "Exportar CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
