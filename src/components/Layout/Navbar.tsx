import React from 'react';
import { BarChart3, PlusCircle, Settings } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';

const Navbar: React.FC = () => {
  const { selectedMonth, addExpense } = useExpenses();
  
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleAddExpense = () =>{
    if(!selectedMonth) return;
    const newExpense = {
      description: 'nova despesa',
      amount: 100,
      category: 'outros',
      date: new Date().toISOString().split('T')[0]
    };
    addExpense(newExpense, selectedMonth)
  }

  return (
    <nav className="bg-indigo-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-xl">Nome da Empresa</span>
          </div>
          
          <div className="flex-1 mx-10">
            <h1 className="text-lg font-medium text-center md:text-left">
              {selectedMonth ? formatMonth(selectedMonth) : 'All Expenses'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
            onClick={handleAddExpense}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">Add Expense</span>
            </button>
            <button className="p-2 hover:bg-indigo-800 rounded-full transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;