import React from 'react';
import { 
  Home, PieChart, BarChart, TrendingUp, Calendar, Download, 
  Settings, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { MONTHS } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { selectedMonth, setSelectedMonth, expenses } = useExpenses();
  
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${MONTHS[parseInt(month) - 1]} ${year}`;
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <PieChart size={20} />, label: 'Categories', active: false },
    { icon: <BarChart size={20} />, label: 'Reports', active: false },
    { icon: <TrendingUp size={20} />, label: 'Trends', active: false },
    { icon: <Calendar size={20} />, label: 'Calendar', active: false },
    { icon: <Download size={20} />, label: 'Export', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
  ];

  return (
    <div className="relative">
      <div 
        className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } fixed left-0 top-0 pt-16 shadow-sm z-10`}
      >
        <button 
          onClick={toggleSidebar}
          className="absolute right-0 top-4 transform translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className="px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    item.active 
                      ? 'bg-indigo-50 text-indigo-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  {isOpen && <span>{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {isOpen && (
          <div className="px-4 py-4 mt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly History</h3>
            <ul className="space-y-1">
              {expenses.map((expense) => (
                <li key={expense.month}>
                  <button
                    onClick={() => setSelectedMonth(expense.month)}
                    className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                      selectedMonth === expense.month 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {formatMonth(expense.month)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;