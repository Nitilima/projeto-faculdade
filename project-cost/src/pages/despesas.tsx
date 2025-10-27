import { useState, useEffect } from "react";

interface Categoria {
  id: number;
  name: string;
}

interface Despesa {
  id: number;
  description: string;
  value: number;
  date: string;
  category: Categoria;
}

export default function Despesas() {
  // estados do formulário
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [mes, setMes] = useState("");
  const [descricao, setDescricao] = useState("");

  // estados da lista e categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  // buscar categorias do backend
  useEffect(() => {
    fetch("http://localhost:8000/categories")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  }, []);

  // buscar despesas do backend
  useEffect(() => {
    fetch("http://localhost:8000/expenses/")
      .then((res) => res.json())
      .then((data) => setDespesas(data))
      .catch((err) => console.error(err));
  }, []);

  const adicionarDespesa = async () => {
    if (!categoria || !valor || !mes || !descricao) return;

    const data = {
      category_id: parseInt(categoria),
      value: valor,
      date: new Date(`${mes}-01`),
      description: descricao,
    };

    try {
      const res = await fetch("http://localhost:8000/expenses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar despesa");

      const novaDespesa = await res.json();
      setDespesas([...despesas, novaDespesa]);

      // limpar campos
      setCategoria("");
      setValor("");
      setMes("");
      setDescricao("");
    } catch (err) {
      console.error(err);
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
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
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
          <div>Mês</div>
          <div>Descrição</div>
          <div>Ações</div>
        </div>

        <div className="p-6 rounded-lg mt-4 bg-[#f6f6f6]">
          {despesas.map((d) => (
            <div key={d.id} className="grid grid-cols-5 gap-4 py-2 border-b">
              <div>{d.category.name}</div>
              <div>{d.value}</div>
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
