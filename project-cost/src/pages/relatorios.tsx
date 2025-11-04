export default function Relatorios() {
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
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              Relatório Mensal
            </h3>
            <p className="text-gray-600 mb-4">
              Visualize seus gastos por mês e categoria
            </p>
            <button className="bg-[#357ade] text-white px-4 py-2 rounded-lg hover:bg-[#2868c7]">
              Gerar Relatório
            </button>
          </div>

          <div className="flex-1 min-w-[300px] shadow-lg p-6 rounded-lg border-l-4 border-[#62b8bc] bg-white">
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              Relatório Anual
            </h3>
            <p className="text-gray-600 mb-4">
              Análise completa do ano com gráficos e estatísticas
            </p>
            <button className="bg-[#62b8bc] text-white px-4 py-2 rounded-lg hover:bg-[#4fa5a9]">
              Gerar Relatório
            </button>
          </div>

          <div className="flex-1 min-w-[300px] shadow-lg p-6 rounded-lg border-l-4 border-[#357ade] bg-white">
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              Exportar Dados
            </h3>
            <p className="text-gray-600 mb-4">
              Exporte seus dados em formato CSV ou PDF
            </p>
            <button className="bg-[#357ade] text-white px-4 py-2 rounded-lg hover:bg-[#2868c7]">
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de resumo */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <h2 className="font-semibold text-2xl text-gray-800 mb-4">
          Resumo por Categoria
        </h2>

        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-600 text-center py-8">
            Selecione um período acima para visualizar o resumo
          </p>
        </div>
      </div>
    </div>
  );
}
