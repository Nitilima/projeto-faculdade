import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategorySummary } from '../../types';

const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500',
  'bg-green-500', 'bg-orange-500'
];

const CategoryBreakdown: React.FC = () => {
  const { expenses, selectedMonth } = useExpenses();
  
  const selectedMonthData = expenses.find(e => e.month === selectedMonth);
  
  const categorySummary = useMemo(() => {
    if (!selectedMonthData) return [];
    
    const categories: Record<string, number> = {};
    
    selectedMonthData.expenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    const result: CategorySummary[] = Object.entries(categories).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / selectedMonthData.totalAmount) * 100
    }));
    
    // Sort by amount (highest first)
    return result.sort((a, b) => b.amount - a.amount);
  }, [selectedMonthData]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Category Breakdown</h2>
        <div className="bg-indigo-100 p-2 rounded-full">
          <PieChart className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-80">
        {categorySummary.length > 0 ? (
          <ul className="space-y-4">
            {categorySummary.map((category, index) => (
              <li key={category.category} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${COLORS[index % COLORS.length]} h-2.5 rounded-full`} 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {category.percentage.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-400">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;