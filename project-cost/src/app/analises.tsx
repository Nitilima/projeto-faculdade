import GraficoAnalises from "../components/grafico-analises";

export default function Analises() {
  return (
    <div>
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
        {/* Título principal */}
        <h1 className="font-bold text-3xl text-gray-800">
          Comparações e Análises
        </h1>

        <p className="text-lg text-gray-800 mt-2 leading-relaxed">
          Tendência de gastos mensais
        </p>

        <GraficoAnalises />

        {/* Container dos 3 cards lado a lado */}
        <div className="flex flex-wrap gap-4 mt-4"></div>
      </div>

      {/* Novo título */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <h2 className="font-semibold text-2xl text-gray-800 mb-4">
          Distribuição por categoria
        </h2>
      </div>
    </div>
  );
}
