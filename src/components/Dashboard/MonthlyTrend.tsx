import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { MONTHS } from '../../data/mockData';

const MonthlyTrend: React.FC = () => {
  const { expenses } = useExpenses();
  
  // Sort expenses by month
  const sortedExpenses = [...expenses].sort((a, b) => a.month.localeCompare(b.month));
  
  // Find the highest amount for scaling
  const maxAmount = Math.max(...sortedExpenses.map(e => e.totalAmount));
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatMonthName = (monthStr: string) => {
    const [_, month] = monthStr.split('-');
    return MONTHS[parseInt(month) - 1].substring(0, 3);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Monthly Trend</h2>
        <div className="bg-green-100 p-2 rounded-full">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-2 mt-4">
        {sortedExpenses.map((expense) => {
          const height = (expense.totalAmount / maxAmount) * 100;
          return (
            <div 
              key={expense.month} 
              className="flex flex-col items-center flex-1"
            >
              <div className="relative w-full group">
                <div 
                  className="bg-indigo-500 hover:bg-indigo-600 rounded-t-md w-full transition-all"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {formatCurrency(expense.totalAmount)}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 font-medium">
                {formatMonthName(expense.month)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total Spending Trend</span>
          <span>{expenses.length} months</span>
        </div>
        
        {sortedExpenses.length > 1 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Average Monthly Expense:</span>
              <span className="font-medium">
                {formatCurrency(
                  sortedExpenses.reduce((sum, e) => sum + e.totalAmount, 0) / sortedExpenses.length
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTrend;