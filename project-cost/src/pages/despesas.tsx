import { useState, useEffect } from "react";
import {
  getCategorias,
  getDespesas,
  createDespesa,
  type Categoria,
  type Despesa,
} from "../services/api";

export default function Despesas() {
  // estados do formulário
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");

  // estados da lista e categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  // buscar categorias do backend
  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  }, []);

  // buscar despesas do backend
  useEffect(() => {
    getDespesas()
      .then((data) => setDespesas(data))
      .catch((err) => console.error(err));
  }, []);

  const adicionarDespesa = async () => {
    if (!categoria || !valor || !data || !descricao) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const despesaData = {
      category_id: parseInt(categoria),
      amount: Number(valor),
      date: data, // já está no formato YYYY-MM-DD
      description: descricao,
    };

    console.log("Enviando dados:", despesaData);

    try {
      const novaDespesa = await createDespesa(despesaData);
      console.log("Despesa criada:", novaDespesa);
      setDespesas([...despesas, novaDespesa]);

      // limpar campos
      setCategoria("");
      setValor("");
      setData("");
      setDescricao("");

      alert("Despesa adicionada com sucesso!");
    } catch (err) {
      console.error("Erro completo:", err);
      alert("Erro ao adicionar despesa. Verifique o console.");
    }
  };

  return (
    <div>
      {/* Formulário */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
        <h1 className="font-bold text-3xl text-gray-800">Gerenciar Gastos</h1>
        <p className="text-lg text-gray-600 mt-2 leading-relaxed">
          Nova Despesa
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-[calc(50%-8px)] p-2 border rounded-lg font-bold bg-[#f6f6f6]"
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Valor"
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
          />

          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-[calc(50%-8px)] p-2 border rounded-lg placeholder-black font-bold bg-[#f6f6f6]"
            placeholder="Descrição"
          />

          <button
            onClick={adicionarDespesa}
            className="bg-[#357ade] text-white px-6 py-2 rounded-xl mt-2 self-start"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de despesas */}
      <div className="flex-1 flex flex-col bg-[#f6f6f6] shadow-lg p-6 rounded-3xl mt-8">
        <h2 className="font-semibold text-2xl text-gray-800 mb-4">
          Despesas Cadastradas
        </h2>

        <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b pb-2">
          <div>Categoria</div>
          <div>Valor</div>
          <div>Data</div>
          <div>Descrição</div>
          <div>Ações</div>
        </div>

        <div className="p-6 rounded-lg mt-4 bg-[#f6f6f6]">
          {despesas.map((d) => (
            <div key={d.id} className="grid grid-cols-5 gap-4 py-2 border-b">
              <div>{d.category.name}</div>
              <div>R$ {d.amount.toFixed(2)}</div>
              <div>
                {new Date(d.date).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>{d.description}</div>
              <div>
                {/* Aqui você pode adicionar botões de editar ou deletar */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
