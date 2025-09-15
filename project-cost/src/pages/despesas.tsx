export default function Despesas() {
  return (
    <div>
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
        {/* Título principal */}
        <h1 className="font-bold text-3xl text-gray-800">Gerenciar Gastos</h1>

        <p className="text-lg text-gray-600 mt-2 leading-relaxed">
          Nova Despesa
        </p>

        {/* Container dos 3 cards lado a lado */}
        <div className="flex flex-wrap gap-4 mt-4">
          <input
            type="text"
            name="Categoria"
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Categoria"
          />
          <input
            type="number"
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Valor"
          />
          <input
            type="text"
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Mês"
          />
          <input
            type="text"
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Descrição"
          />

          {/* Botão menor, sozinho na linha */}
          <button className="bg-[#357ade] text-white px-6 py-2 rounded-xl mt-2 self-start">
            Adicionar
          </button>
        </div>
      </div>

      {/* Novo título */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <h2 className="font-semibold text-2xl text-gray-800 mb-4">
          Despesas Cadastradas
        </h2>

        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b pb-2">
          <div>Categoria</div>
          <div>Valor</div>
          <div>Mês</div>
          <div>Descrição</div>
          <div>Ações</div>
        </div>

        {/* Container da lista */}
        <div className="p-6 rounded-lg mt-4 bg-[#f6f6f6]">
          {/* Aqui vai o conteúdo das despesas */}
          <p>Lista de despesas...</p>
        </div>
      </div>
    </div>
  );
}
