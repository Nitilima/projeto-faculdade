const API_BASE_URL = "http://localhost:8000";

// Interfaces
export interface Categoria {
  id: number;
  name: string;
  carbon_footprint: number;
  sustainability_level: string;
}

export interface Despesa {
  id: string;
  description: string;
  amount: number;
  date: string;
  month: string;
  year: number;
  category_id: number;
  category: Categoria;
}

export interface DespesaCreate {
  category_id: number;
  amount: number;
  date: string;
  description: string;
}

export interface MonthlyExpense {
  month: string;
  gastos: number;
}

export interface CategoryAnalysis {
  category_id: number;
  category_name: string;
  total_amount: number;
  percentage: number;
  carbon_emissions: number;
  sustainability_level: string;
  expense_count: number;
}

export interface Recommendation {
  title: string;
  description: string;
  investment: number;
  monthly_savings: number;
  monthly_co2_reduction: number;
  payback_months: number;
  priority: string;
}

export interface SustainabilityReport {
  category_id: number;
  category_name: string;
  current_spending: number;
  current_co2: number;
  suggestion: string;
}

// Funções de API

// Categorias
export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch(`${API_BASE_URL}/expenses/categories`);
  if (!response.ok) throw new Error("Erro ao buscar categorias");
  return response.json();
};

export const createCategoria = async (name: string): Promise<Categoria> => {
  const response = await fetch(`${API_BASE_URL}/expenses/create-category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Erro ao criar categoria");
  return response.json();
};

// Despesas
export const getDespesas = async (): Promise<Despesa[]> => {
  const response = await fetch(`${API_BASE_URL}/expenses/`);
  if (!response.ok) throw new Error("Erro ao buscar despesas");
  return response.json();
};

export const createDespesa = async (
  despesa: DespesaCreate
): Promise<Despesa> => {
  const response = await fetch(`${API_BASE_URL}/expenses/create-expense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(despesa),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Erro da API:", errorData);
    throw new Error(`Erro ao criar despesa: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

// Estatísticas
export const getMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  const response = await fetch(`${API_BASE_URL}/expenses/monthly`);
  if (!response.ok) throw new Error("Erro ao buscar gastos mensais");
  return response.json();
};

// Funções auxiliares para o Dashboard
export const getDashboardStats = async () => {
  const [despesas, categorias] = await Promise.all([
    getDespesas(),
    getCategorias(),
  ]);

  const totalGastos = despesas.reduce((sum, d) => sum + d.amount, 0);

  // Extrair meses únicos das despesas
  const mesesUnicos = new Set(
    despesas.map((d) => `${d.month}/${d.year}`)
  );

  return {
    totalGastos,
    totalCategorias: categorias.length,
    mesesRegistrados: mesesUnicos.size,
  };
};

// Análise de Sustentabilidade
export const getCategoryAnalysis = async (): Promise<CategoryAnalysis[]> => {
  const response = await fetch(`${API_BASE_URL}/expenses/analysis/by-category`);
  if (!response.ok) throw new Error("Erro ao buscar análise de categorias");
  return response.json();
};

export const getRecommendations = async (
  categoryId: number
): Promise<SustainabilityReport> => {
  const response = await fetch(
    `${API_BASE_URL}/expenses/recommendations/${categoryId}`
  );
  if (!response.ok) throw new Error("Erro ao buscar recomendações");
  return response.json();
};
