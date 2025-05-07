export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string format
}

export interface MonthlyExpense {
  month: string; // Format: YYYY-MM
  totalAmount: number;
  expenses: Expense[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthComparison {
  currentMonth: string;
  previousMonth: string;
  difference: number;
  percentageChange: number;
}