import { useState } from "react";
import {
  Home,
  DollarSign,
  Settings,
  MoveDiagonal,
  Menu,
  ChartColumnBig,
  CircleUserRound,
  Bell,
} from "lucide-react";
import Analises from "./analises";
// import Dashboard from "./dashboard";
// import Despesas from "./despesas";

export default function MainApp() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-[#efefef]">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } h-screen bg-[#f6f6f6] text-[#373737] font-bold flex flex-col transition-all duration-300 shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>
            Cost App
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li className="flex items-center gap-4 cursor-pointer group">
              <Home className="w-6 h-6 group-hover:text-[#62b8bc]" />
              {isOpen && (
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text">
                  Dashboard
                </span>
              )}
            </li>
            <li className="flex items-center gap-4 cursor-pointer group">
              <DollarSign className="w-6 h-6 group-hover:text-[#62b8bc]" />
              {isOpen && (
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text">
                  Gastos
                </span>
              )}
            </li>
            <li className="flex items-center gap-4 cursor-pointer group">
              <MoveDiagonal className="w-6 h-6 group-hover:text-[#62b8bc]" />
              {isOpen && (
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text">
                  Análises
                </span>
              )}
            </li>
            <li className="flex items-center gap-4 cursor-pointer group">
              <ChartColumnBig className="w-6 h-6 group-hover:text-[#62b8bc]" />
              {isOpen && (
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text">
                  Relatórios
                </span>
              )}
            </li>
            <li className="flex items-center gap-4 cursor-pointer group">
              <Settings className="w-6 h-6 group-hover:text-[#62b8bc]" />
              {isOpen && (
                <span className="group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text">
                  Configurações
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-gradient-to-r from-[#62b8bc] to-[#357ade] shadow-lg flex items-center justify-end px-4 gap-4">
          <Bell className="w-6 h-6 text-white" />
          <CircleUserRound className="w-6 h-6 text-white" />
        </div>
        <main className="flex-1 p-6">
          <Analises />
        </main>
      </div>
    </div>
  );
}
