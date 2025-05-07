import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const ExpenseSummary: React.FC = () => {
  const { expenses, selectedMonth, compareMonth } = useExpenses();
  
  const currentMonthData = expenses.find(e => e.month === selectedMonth);
  const previousMonthData = expenses.find(e => e.month === compareMonth);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const calculateChange = () => {
    if (!currentMonthData || !previousMonthData) return null;
    
    const change = currentMonthData.totalAmount - previousMonthData.totalAmount;
    const percentage = (change / previousMonthData.totalAmount) * 100;
    
    return {
      amount: change,
      percentage: percentage,
      increased: change > 0
    };
  };
  
  const change = calculateChange();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-gray-500 text-sm font-medium">Total Expenses</h2>
          <p className="text-3xl font-bold mt-1">
            {currentMonthData ? formatCurrency(currentMonthData.totalAmount) : 'N/A'}
          </p>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.increased ? (
                <div className="flex items-center text-red-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {formatCurrency(Math.abs(change.amount))} ({Math.abs(change.percentage).toFixed(1)}%)
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-emerald-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {formatCurrency(Math.abs(change.amount))} ({Math.abs(change.percentage).toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-blue-100 p-3 rounded-full">
          <DollarSign className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          {change 
            ? `Compared to ${formatCurrency(previousMonthData?.totalAmount || 0)} last month`
            : 'No comparison data available'
          }
        </p>
      </div>
    </div>
  );
};

export default ExpenseSummary;