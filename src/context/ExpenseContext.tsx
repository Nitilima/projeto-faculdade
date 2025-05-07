import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense, MonthlyExpense } from '../types';
import { mockExpenses } from '../data/mockData';

interface ExpenseContextType {
  expenses: MonthlyExpense[];
  addExpense: (expense: Omit<Expense, 'id'>, month: string) => void;
  deleteExpense: (id: string, month: string) => void;
  updateExpense: (expense: Expense, month: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  compareMonth: string;
  setCompareMonth: (month: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<MonthlyExpense[]>(mockExpenses);
  const [selectedMonth, setSelectedMonth] = useState<string>(mockExpenses[mockExpenses.length - 1].month);
  const [compareMonth, setCompareMonth] = useState<string>(mockExpenses.length > 1 ? mockExpenses[mockExpenses.length - 2].month : '');

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>, month: string) => {
    setExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses];
      const monthIndex = updatedExpenses.findIndex(e => e.month === month);
      
      const expenseWithId: Expense = {
        ...newExpense,
        id: generateId()
      };
      
      if (monthIndex !== -1) {
        // Month exists, add expense to it
        const updatedMonth = {
          ...updatedExpenses[monthIndex],
          expenses: [...updatedExpenses[monthIndex].expenses, expenseWithId],
          totalAmount: updatedExpenses[monthIndex].totalAmount + newExpense.amount
        };
        updatedExpenses[monthIndex] = updatedMonth;
      } else {
        // Month doesn't exist, create new month entry
        updatedExpenses.push({
          month,
          totalAmount: newExpense.amount,
          expenses: [expenseWithId]
        });
      }
      
      return updatedExpenses;
    });
  };

  const deleteExpense = (id: string, month: string) => {
    setExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses];
      const monthIndex = updatedExpenses.findIndex(e => e.month === month);
      
      if (monthIndex !== -1) {
        const expense = updatedExpenses[monthIndex].expenses.find(e => e.id === id);
        if (expense) {
          const updatedMonth = {
            ...updatedExpenses[monthIndex],
            expenses: updatedExpenses[monthIndex].expenses.filter(e => e.id !== id),
            totalAmount: updatedExpenses[monthIndex].totalAmount - expense.amount
          };
          updatedExpenses[monthIndex] = updatedMonth;
        }
      }
      
      return updatedExpenses;
    });
  };

  const updateExpense = (updatedExpense: Expense, month: string) => {
    setExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses];
      const monthIndex = updatedExpenses.findIndex(e => e.month === month);
      
      if (monthIndex !== -1) {
        const expenseIndex = updatedExpenses[monthIndex].expenses.findIndex(e => e.id === updatedExpense.id);
        
        if (expenseIndex !== -1) {
          const oldAmount = updatedExpenses[monthIndex].expenses[expenseIndex].amount;
          const newAmount = updatedExpense.amount;
          
          // Update the expense
          updatedExpenses[monthIndex].expenses[expenseIndex] = updatedExpense;
          
          // Update the total amount
          updatedExpenses[monthIndex].totalAmount = 
            updatedExpenses[monthIndex].totalAmount - oldAmount + newAmount;
        }
      }
      
      return updatedExpenses;
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        selectedMonth,
        setSelectedMonth,
        compareMonth,
        setCompareMonth
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};