import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendar, 
  FaCut, 
  FaChartBar,
  FaCog,
  FaBars
} from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome size={20} />, path: '/dashboard', enabled: true },
    { name: 'Reservas', icon: <FaCalendar size={20} />, path: '/dashboard/reservas', enabled: true },
    { name: 'Servicios', icon: <FaCut size={20} />, path: '/dashboard/servicios', enabled: true },
    { name: 'Reportes', icon: <FaChartBar size={20} />, path: '/dashboard/reportes', enabled: false },
    { name: 'Config', icon: <FaCog size={20} />, path: '/dashboard/config', enabled: true }
  ];
  
  // En el mapeo del menú
  {menuItems.map((item, index) => (
    item.enabled && (
      <Link
        key={index}
        to={item.path}
        className={`
          flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white
          transition-colors duration-200
          ${isCollapsed ? 'justify-center' : 'space-x-3'}
        `}
      >
        <span>{item.icon}</span>
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    )
  ))}

  return (
    <>
      {/* Botón móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-barber-primary text-white rounded-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-barber-primary text-white
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
        md:translate-x-0
        ${isCollapsed ? '-translate-x-full md:translate-x-0' : ''}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <img 
            src="/src/assets/scissors.svg" 
            alt="Logo" 
            className={`mx-auto transition-all ${isCollapsed ? 'w-8' : 'w-32'}`}
          />
        </div>

        {/* Menú */}
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white
                transition-colors duration-200
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              <span>{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-10 bg-barber-primary p-1 rounded-full"
        >
          <FaBars size={20} />
        </button>
      </aside>

      {/* Overlay para móvil */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;