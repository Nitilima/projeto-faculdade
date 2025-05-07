import React, { useState } from 'react';
import { List, Search, Filter, ChevronDown, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { Expense } from '../../types';

const ExpenseList: React.FC = () => {
  const { expenses, selectedMonth, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const selectedMonthData = expenses.find(e => e.month === selectedMonth);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const filteredExpenses = selectedMonthData?.expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? expense.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  }) || [];
  
  // Get unique categories from the current month's expenses
  const categories = selectedMonthData?.expenses.reduce<string[]>((acc, expense) => {
    if (!acc.includes(expense.category)) {
      acc.push(expense.category);
    }
    return acc;
  }, []) || [];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium">Expense Transactions</h2>
          <div className="bg-gray-100 ml-2 px-2 py-1 rounded text-xs font-medium text-gray-600">
            {filteredExpenses.length} items
          </div>
        </div>
        <div className="bg-indigo-100 p-2 rounded-full">
          <List className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      
      <div className="mb-4 flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <button className="flex items-center justify-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
          <PlusCircle className="h-4 w-4" />
          <span>Add New</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        {filteredExpenses.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{expense.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                        onClick={() => deleteExpense(expense.id, selectedMonth)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-gray-400">
            <List className="h-12 w-12 mb-2" />
            <p>No expense transactions found</p>
            <p className="text-sm">Try adjusting your filters or adding new expenses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;