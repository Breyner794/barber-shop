import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Home,
  Calendar,
  Briefcase,
  BarChart2,
  UserPen,
  LogOut,
  HousePlus,
} from "lucide-react";
import {useAuth} from "../../context/authContext"
import { useUsers } from "../../context/UserContext";

const SidebarDashboard = ({ isOpen, onClose }) => {

  const {logout} = useAuth();
  const { currentUser, getMe, loading} = useUsers();

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    // Only fetch profile if we don't already have it
    if (!currentUser) {
      console.log("Fetching user profile...");
      getMe().catch(error => {
        console.error("Error al cargar el perfil:", error);
      });
    }
  }, [currentUser, getMe]);

  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return "U";
    return currentUser.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

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
      name: "Barberos",
      icon: <UserPen size={20} />,
      path: "/dashboard/barberosadminpanel",
      enabled: true,
    },
    {
      name: "Sedes - Locales",
      icon: <HousePlus size={20} />,
      path: "/dashboard/sedesadminPanel",
      enabled: true,
    },
    {
      name: "Reportes",
      icon: <BarChart2 size={20} />,
      path: "/dashboard/reportes",
      enabled: false,
    },
    {
      name: "Usuarios",
      icon: <UserPen size={20} />,
      path: "/dashboard/usuariosadminpanel",
      enabled: true,
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out `}
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

      <nav className="px-2 py-4 flex-grow">
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

      <div className="px-4 py-3 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {loading ? "..." : getUserInitials()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate">
              {loading ? "Cargando..." : (currentUser?.name || 'Usuario')}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {loading ? "" : (currentUser?.role || 'Rol no definido')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto px-4 py-3">
      <button
        onClick={logout} 
        className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut size={18} className="mr-3" />
        <span>Cerrar sesión</span>
      </button>
    </div>
    </div>
  );
};

export default SidebarDashboard;
