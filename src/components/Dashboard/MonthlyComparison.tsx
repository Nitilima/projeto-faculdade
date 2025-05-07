import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { MONTHS } from '../../data/mockData';

const MonthlyComparison: React.FC = () => {
  const { expenses, selectedMonth, compareMonth, setCompareMonth } = useExpenses();
  
  const availableMonths = useMemo(() => {
    return expenses
      .map(e => e.month)
      .sort((a, b) => a.localeCompare(b))
      .filter(month => month !== selectedMonth);
  }, [expenses, selectedMonth]);
  
  const selectedMonthData = expenses.find(e => e.month === selectedMonth);
  const compareMonthData = expenses.find(e => e.month === compareMonth);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${MONTHS[parseInt(month) - 1]} ${year}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Monthly Comparison</h2>
        <div className="bg-amber-100 p-2 rounded-full">
          <BarChart3 className="h-5 w-5 text-amber-600" />
        </div>
      </div>
      
      {selectedMonthData && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Month</h3>
              <p className="text-lg font-semibold mt-1">
                {formatMonthName(selectedMonth)}
              </p>
            </div>
            
            <div className="flex items-center">
              <select
                className="text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={compareMonth}
                onChange={(e) => setCompareMonth(e.target.value)}
              >
                <option value="">Select month to compare</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>
                    {formatMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{formatMonthName(selectedMonth)}</span>
                <span className="text-sm font-medium">{formatCurrency(selectedMonthData.totalAmount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            
            {compareMonthData && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{formatMonthName(compareMonth)}</span>
                  <span className="text-sm font-medium">{formatCurrency(compareMonthData.totalAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-amber-500 h-3 rounded-full"
                    style={{ 
                      width: `${(compareMonthData.totalAmount / selectedMonthData.totalAmount) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {compareMonthData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Difference Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Absolute Difference:</span>
                  <span className={`text-sm font-medium ${
                    selectedMonthData.totalAmount > compareMonthData.totalAmount 
                      ? 'text-red-500' 
                      : 'text-emerald-500'
                  }`}>
                    {formatCurrency(Math.abs(selectedMonthData.totalAmount - compareMonthData.totalAmount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Percentage Change:</span>
                  <span className={`text-sm font-medium ${
                    selectedMonthData.totalAmount > compareMonthData.totalAmount 
                      ? 'text-red-500' 
                      : 'text-emerald-500'
                  }`}>
                    {(Math.abs(selectedMonthData.totalAmount - compareMonthData.totalAmount) / compareMonthData.totalAmount * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyComparison;