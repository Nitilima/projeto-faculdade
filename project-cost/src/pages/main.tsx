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
import Dashboard from "./dashboard";
import Despesas from "./despesas";
import Relatorios from "./relatorios";

type Page = "dashboard" | "gastos" | "analises" | "relatorios" | "configuracoes";

export default function MainApp() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "gastos":
        return <Despesas />;
      case "analises":
        return <Analises />;
      case "relatorios":
        return <Relatorios />;
      case "configuracoes":
        return (
          <div className="bg-[#f6f6f6] shadow-lg p-6 rounded-3xl">
            <h1 className="font-bold text-3xl text-gray-800">Configurações</h1>
            <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

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
            <li
              onClick={() => setCurrentPage("dashboard")}
              className={`flex items-center gap-4 cursor-pointer group transition-all ${
                currentPage === "dashboard" ? "bg-[#357ade] bg-opacity-10 rounded-lg p-2" : ""
              }`}
            >
              <Home
                className={`w-6 h-6 group-hover:text-[#62b8bc] ${
                  currentPage === "dashboard" ? "text-[#357ade]" : ""
                }`}
              />
              {isOpen && (
                <span
                  className={`group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text ${
                    currentPage === "dashboard" ? "text-[#357ade] font-bold" : ""
                  }`}
                >
                  Dashboard
                </span>
              )}
            </li>
            <li
              onClick={() => setCurrentPage("gastos")}
              className={`flex items-center gap-4 cursor-pointer group transition-all ${
                currentPage === "gastos" ? "bg-[#357ade] bg-opacity-10 rounded-lg p-2" : ""
              }`}
            >
              <DollarSign
                className={`w-6 h-6 group-hover:text-[#62b8bc] ${
                  currentPage === "gastos" ? "text-[#357ade]" : ""
                }`}
              />
              {isOpen && (
                <span
                  className={`group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text ${
                    currentPage === "gastos" ? "text-[#357ade] font-bold" : ""
                  }`}
                >
                  Gastos
                </span>
              )}
            </li>
            <li
              onClick={() => setCurrentPage("analises")}
              className={`flex items-center gap-4 cursor-pointer group transition-all ${
                currentPage === "analises" ? "bg-[#357ade] bg-opacity-10 rounded-lg p-2" : ""
              }`}
            >
              <MoveDiagonal
                className={`w-6 h-6 group-hover:text-[#62b8bc] ${
                  currentPage === "analises" ? "text-[#357ade]" : ""
                }`}
              />
              {isOpen && (
                <span
                  className={`group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text ${
                    currentPage === "analises" ? "text-[#357ade] font-bold" : ""
                  }`}
                >
                  Análises
                </span>
              )}
            </li>
            <li
              onClick={() => setCurrentPage("relatorios")}
              className={`flex items-center gap-4 cursor-pointer group transition-all ${
                currentPage === "relatorios" ? "bg-[#357ade] bg-opacity-10 rounded-lg p-2" : ""
              }`}
            >
              <ChartColumnBig
                className={`w-6 h-6 group-hover:text-[#62b8bc] ${
                  currentPage === "relatorios" ? "text-[#357ade]" : ""
                }`}
              />
              {isOpen && (
                <span
                  className={`group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text ${
                    currentPage === "relatorios" ? "text-[#357ade] font-bold" : ""
                  }`}
                >
                  Relatórios
                </span>
              )}
            </li>
            <li
              onClick={() => setCurrentPage("configuracoes")}
              className={`flex items-center gap-4 cursor-pointer group transition-all ${
                currentPage === "configuracoes" ? "bg-[#357ade] bg-opacity-10 rounded-lg p-2" : ""
              }`}
            >
              <Settings
                className={`w-6 h-6 group-hover:text-[#62b8bc] ${
                  currentPage === "configuracoes" ? "text-[#357ade]" : ""
                }`}
              />
              {isOpen && (
                <span
                  className={`group-hover:bg-gradient-to-r group-hover:from-[#62b8bc] group-hover:to-[#357ade] group-hover:text-transparent group-hover:bg-clip-text ${
                    currentPage === "configuracoes" ? "text-[#357ade] font-bold" : ""
                  }`}
                >
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
          <Bell className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" />
          <CircleUserRound className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
