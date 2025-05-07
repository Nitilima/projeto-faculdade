import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { ExpenseProvider } from './context/ExpenseContext';

function App() {
  return (
    <ExpenseProvider>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ExpenseProvider>
  );
}

export default App;