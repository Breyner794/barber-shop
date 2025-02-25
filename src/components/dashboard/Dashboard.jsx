import Sidebar from "./Sidebar";
import { Outlet, Link } from "react-router-dom";

const Dashboard = () => {

    

    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <main className={`transition-all duration-300 md:ml-16 lg:ml-64 p-8`}>
          {/* Contenido del dashboard */}
          
          <Outlet />
        </main>
      </div>
    );
  };

export default Dashboard;