import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  PieChart,
  Settings,
  Plus,
  Trash2,
  Menu,
  Home,
} from "lucide-react";

interface Expense {
  id: number;
  category: string;
  amount: number;
  month: string;
  description: string;
}

const CostProjectApp = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      category: "Marketing",
      amount: 5000,
      month: "2024-01",
      description: "Campanhas digitais",
    },
    {
      id: 2,
      category: "TI",
      amount: 8000,
      month: "2024-01",
      description: "Infraestrutura",
    },
    {
      id: 3,
      category: "RH",
      amount: 12000,
      month: "2024-01",
      description: "Salários",
    },
    {
      id: 4,
      category: "Marketing",
      amount: 4500,
      month: "2024-02",
      description: "Campanhas digitais",
    },
    {
      id: 5,
      category: "TI",
      amount: 7500,
      month: "2024-02",
      description: "Infraestrutura",
    },
    {
      id: 6,
      category: "RH",
      amount: 12500,
      month: "2024-02",
      description: "Salários",
    },
    {
      id: 7,
      category: "Marketing",
      amount: 5500,
      month: "2024-03",
      description: "Campanhas digitais",
    },
    {
      id: 8,
      category: "TI",
      amount: 9000,
      month: "2024-03",
      description: "Infraestrutura",
    },
    {
      id: 9,
      category: "RH",
      amount: 13000,
      month: "2024-03",
      description: "Salários",
    },
  ]);

  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    category: "",
    amount: 0,
    month: "",
    description: "",
  });

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "expenses", label: "Gastos", icon: DollarSign },
    { id: "comparisons", label: "Comparações", icon: TrendingUp },
    { id: "reports", label: "Relatórios", icon: PieChart },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const getMonthlyData = () => {
    const monthlyTotals: Record<string, { month: string; total: number }> = {};
    expenses.forEach((expense) => {
      if (!monthlyTotals[expense.month])
        monthlyTotals[expense.month] = { month: expense.month, total: 0 };
      monthlyTotals[expense.month].total += expense.amount;
    });
    return Object.values(monthlyTotals).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  };

  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.month) {
      setExpenses([...expenses, { id: Date.now(), ...newExpense }]);
      setNewExpense({ category: "", amount: 0, month: "", description: "" });
    }
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const getTotalExpenses = () =>
    expenses.reduce((total, e) => total + e.amount, 0);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Gastos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(getTotalExpenses())}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-gray-900">
                {getCategoryData().length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <PieChart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Meses Registrados
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getMonthlyData().length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Evolução de Gastos por Mês
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={getMonthlyData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Nova Despesa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecionar categoria</option>
              <option value="Marketing">Marketing</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Operacional">Operacional</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Vendas">Vendas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              value={newExpense.amount || ""}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <input
              type="month"
              value={newExpense.month}
              onChange={(e) =>
                setNewExpense({ ...newExpense, month: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição da despesa"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleAddExpense}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" /> Adicionar Despesa
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Despesas Cadastradas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold">Categoria</th>
                <th className="text-left p-3 font-semibold">Valor</th>
                <th className="text-left p-3 font-semibold">Mês</th>
                <th className="text-left p-3 font-semibold">Descrição</th>
                <th className="text-left p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="p-3">{expense.month}</td>
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderComparisons = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Tendência de Gastos Mensais
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={getMonthlyData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Distribuição por Categoria
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={getCategoryData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "expenses":
        return renderExpenses();
      case "comparisons":
        return renderComparisons();
      case "reports":
        return (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Relatórios
            </h3>
            <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white p-12 rounded-lg shadow-lg text-center">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Configurações
            </h3>
            <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          isMenuOpen ? "w-64" : "w-20"
        } bg-white shadow-xl transition-all duration-300 flex-shrink-0 border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isMenuOpen && (
            <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cost Project
            </h1>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-4 text-left hover:bg-gray-50 transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {isMenuOpen && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-8 flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === "dashboard"
                ? "Dashboard Principal"
                : activeSection === "expenses"
                ? "Gerenciar Gastos"
                : activeSection === "comparisons"
                ? "Comparações e Análises"
                : activeSection === "reports"
                ? "Relatórios"
                : "Configurações"}
            </h2>
            <p className="text-gray-600">
              {activeSection === "dashboard"
                ? "Visão geral dos seus gastos e métricas importantes"
                : activeSection === "expenses"
                ? "Adicione e gerencie suas despesas mensais"
                : activeSection === "comparisons"
                ? "Analise tendências e compare gastos por período"
                : activeSection === "reports"
                ? "Gere relatórios detalhados"
                : "Configure suas preferências do sistema"}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CostProjectApp;
