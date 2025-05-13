import React from 'react';
import ExpenseSummary from '../components/Dashboard/ExpenseSummary';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import MonthlyComparison from '../components/Dashboard/MonthlyComparison';
import ExpenseList from '../components/Dashboard/ExpenseList';
import MonthlyTrend from '../components/Dashboard/MonthlyTrend';
import ExpenseManager from '../components/Dashboard/ExpenseManager';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExpenseSummary />
        <div className="md:col-span-2">
          <MonthlyTrend />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryBreakdown />
        <MonthlyComparison />
      </div>

      <ExpenseManager></ExpenseManager>
      
      <ExpenseList />
    </div>
  );
};

export default Dashboard;