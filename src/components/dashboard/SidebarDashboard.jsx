import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Home,
  Calendar,
  Briefcase,
  BarChart2,
  Settings,
  UserPen,
  HousePlus
} from "lucide-react";

const SidebarDashboard = ({ isOpen, onClose }) => {

  
  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/dashboard",
      enabled: true,
    },
    {
      name: "Reservas",
      icon: <Calendar size={20} />,
      path: "/dashboard/gestionreservas",
      enabled: true,
    },
    {
      name: "Servicios",
      icon: <Briefcase size={20} />,
      path: "/dashboard/servicesadminpanel",
      enabled: true,
    },
    {
      name: "Usuarios",
      icon: <UserPen size={20} />,
      path: "/dashboard/adminuser",
      enabled: true,
    },
    {
      name: "Sedes - Locales",
      icon: <HousePlus size={20} />,
      path: "/dashboard/gestionsedes",
      enabled: true,
    },
    {
      name: "Reportes",
      icon: <BarChart2 size={20} />,
      path: "/dashboard/reportes",
      enabled: false,
    },
    {
      name: "Config",
      icon: <Settings size={20} />,
      path: "/dashboard/config",
      enabled: true,
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Panel De Control</h1>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 md:hidden"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map(
            (item, index) =>
              item.enabled && (
                <Link
                  key={index}
                  to={item.path}
                  className={`
            flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100
          `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {<span>{item.name}</span>}
                </Link>
              )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarDashboard;
