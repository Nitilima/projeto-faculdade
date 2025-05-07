import { MonthlyExpense } from '../types';

export const CATEGORIES = [
  'Office Supplies',
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Software',
  'Travel',
  'Maintenance',
  'Insurance',
  'Other',
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

export const mockExpenses: MonthlyExpense[] = [
  {
    month: '2025-01',
    totalAmount: 12500,
    expenses: [
      { id: '1-1', amount: 2500, category: 'Rent', description: 'Office rent', date: '2025-01-05T00:00:00Z' },
      { id: '1-2', amount: 5000, category: 'Salaries', description: 'Employee salaries', date: '2025-01-15T00:00:00Z' },
      { id: '1-3', amount: 1000, category: 'Utilities', description: 'Electricity and water', date: '2025-01-20T00:00:00Z' },
      { id: '1-4', amount: 1500, category: 'Marketing', description: 'Online advertising', date: '2025-01-10T00:00:00Z' },
      { id: '1-5', amount: 500, category: 'Office Supplies', description: 'Stationery and supplies', date: '2025-01-08T00:00:00Z' },
      { id: '1-6', amount: 800, category: 'Software', description: 'Software subscriptions', date: '2025-01-02T00:00:00Z' },
      { id: '1-7', amount: 1200, category: 'Insurance', description: 'Business insurance', date: '2025-01-01T00:00:00Z' },
    ]
  },
  {
    month: '2025-02',
    totalAmount: 13800,
    expenses: [
      { id: '2-1', amount: 2500, category: 'Rent', description: 'Office rent', date: '2025-02-05T00:00:00Z' },
      { id: '2-2', amount: 5000, category: 'Salaries', description: 'Employee salaries', date: '2025-02-15T00:00:00Z' },
      { id: '2-3', amount: 1200, category: 'Utilities', description: 'Electricity and water', date: '2025-02-20T00:00:00Z' },
      { id: '2-4', amount: 2000, category: 'Marketing', description: 'Online advertising', date: '2025-02-10T00:00:00Z' },
      { id: '2-5', amount: 600, category: 'Office Supplies', description: 'Stationery and supplies', date: '2025-02-08T00:00:00Z' },
      { id: '2-6', amount: 800, category: 'Software', description: 'Software subscriptions', date: '2025-02-02T00:00:00Z' },
      { id: '2-7', amount: 1200, category: 'Insurance', description: 'Business insurance', date: '2025-02-01T00:00:00Z' },
      { id: '2-8', amount: 500, category: 'Travel', description: 'Business trip', date: '2025-02-25T00:00:00Z' },
    ]
  },
  {
    month: '2025-03',
    totalAmount: 14200,
    expenses: [
      { id: '3-1', amount: 2500, category: 'Rent', description: 'Office rent', date: '2025-03-05T00:00:00Z' },
      { id: '3-2', amount: 5500, category: 'Salaries', description: 'Employee salaries', date: '2025-03-15T00:00:00Z' },
      { id: '3-3', amount: 1100, category: 'Utilities', description: 'Electricity and water', date: '2025-03-20T00:00:00Z' },
      { id: '3-4', amount: 1800, category: 'Marketing', description: 'Online advertising', date: '2025-03-10T00:00:00Z' },
      { id: '3-5', amount: 700, category: 'Office Supplies', description: 'Stationery and supplies', date: '2025-03-08T00:00:00Z' },
      { id: '3-6', amount: 1000, category: 'Software', description: 'Software subscriptions', date: '2025-03-02T00:00:00Z' },
      { id: '3-7', amount: 1200, category: 'Insurance', description: 'Business insurance', date: '2025-03-01T00:00:00Z' },
      { id: '3-8', amount: 400, category: 'Maintenance', description: 'Office maintenance', date: '2025-03-12T00:00:00Z' },
    ]
  },
];