import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { barberos } from "../../data/barberosData"; // Ajusta la ruta según tu estructura de archivos

const BarberosPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSede, setCurrentSede] = useState("all");

  // Filtrar barberos según búsqueda y sede
  const filteredBarberos = barberos.filter((barbero) => {
    const matchesSearch = 
      barbero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      barbero.apellido.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSede = currentSede === "all" || barbero.sede === parseInt(currentSede);
    
    return matchesSearch && matchesSede;
  });

  // Obtener sedes únicas para el filtro
  const uniqueSedes = [...new Set(barberos.map(barbero => barbero.sede))];

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Barberos</h1>
        
        <Link 
          to="/dashboard/adminuser/nuevo" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Nuevo Barbero</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar barbero..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por sede */}
          <div className="w-full md:w-40">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentSede}
              onChange={(e) => setCurrentSede(e.target.value)}
            >
              <option value="all">Todas las sedes</option>
              {uniqueSedes.map((sede) => (
                <option key={sede} value={sede}>
                  Sede {sede}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de barberos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBarberos.length > 0 ? (
          filteredBarberos.map((barbero) => (
            <div key={barbero.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {barbero.imageUrl ? (
                    <img
                      src={barbero.imageUrl}
                      alt={`${barbero.nombre} ${barbero.apellido}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User size={40} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{barbero.nombre}</h3>
                <p className="text-gray-600">{barbero.apellido}</p>
                <div className="mt-2 text-sm text-gray-500">Sede {barbero.sede}</div>
              </div>
              <div className="flex border-t border-gray-200">
                <Link
                  to={`/dashboard/adminuser/editar/${barbero.id}`}
                  className="flex-1 py-2 text-center text-blue-600 hover:bg-blue-50 transition-colors border-r border-gray-200"
                >
                  <Edit size={16} className="inline mr-1" />
                  <span>Editar</span>
                </Link>
                <button
                  className="flex-1 py-2 text-center text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    // Función para eliminar (a implementar)
                    if (window.confirm(`¿Estás seguro de eliminar a ${barbero.nombre}?`)) {
                      console.log("Eliminando barbero:", barbero.id);
                    }
                  }}
                >
                  <Trash2 size={16} className="inline mr-1" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron barberos con los criterios actuales.
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberosPanel;