import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './SidebarDashboard';
// import GestionReservas from './ReservationsComponent';

const Dashboard = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Toggle sidebar button (solo visible en móvil) */}
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        {/* Reservations Component */}
        <Outlet/>
      </div>
    </div>
  );
};

export default Dashboard;