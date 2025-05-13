import { useState } from "react";
import { PlusCircle, Settings } from "lucide-react";
import { useExpenses } from "../../context/ExpenseContext";

const ExpenseManager = () => {
  const { addExpense, selectedMonth } = useExpenses();
  console.log("selectedMouth", selectedMonth);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  const handleAddExpense = () => {
    setShowForm(true);
  };

  const handleSave = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.date) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    addExpense(newExpense, selectedMonth);

    setNewExpense({
      amount: 0,
      category: "",
      description: "",
      date: "",
    });
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleAddExpense}
          className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden md:inline">Adicionar despesa</span>
        </button>
        <button className="p-2 hover:bg-indigo-800 rounded-full transition-colors duration-200">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {showForm && (
        <div className="mt-4 space-y-2">
          <input
            type="number"
            placeholder="Valor"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: Number(e.target.value) })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
