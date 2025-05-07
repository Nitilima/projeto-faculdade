import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} pt-16 px-6`}>
        <div className="max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;